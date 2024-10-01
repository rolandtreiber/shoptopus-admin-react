import {useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Divider,
} from '@material-ui/core';
import TrButton from "../../../components/common/translated/translated-button";
import {AuthContext} from "../../../contexts/oauth-context";
import { useDialog } from '../../../hooks/use-dialog';
import { ConfirmationDialog } from '../../../components/common/modal/confirmation-dialog';
import { ResourceUnavailable } from '../../../components/common/placeholder/resource-unavailable';
import { Scrollbar } from '../../../components/common/scrollbar';
import {APIContext} from "../../../contexts/api-context";
import {getUrlFilters} from "../../../utils/apply-filters";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductAttributeOptionsTable} from "./product-attribute-options-table"
import {ProductAttributeOptionDialog} from "./product-attribute-option-dialog";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const ProductAttributeOptions = (props) => {
  const { productAttributeType, options: optionsProp, productId, productAttributeId, selectedOption, setSelectedOption, ...other } = props;
  const mounted = useMounted();
  const [optionDialogOpen, handleOpenOptionDialog, handleCloseOptionDialog] = useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [options, setOptions] = useState(optionsProp);
  const {deleteProductAttributeOption, fetchProductAttributeOptions} = useContext(APIContext)
  const {can} = useContext(AuthContext)
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'updated_at',
    view: 'all'
  });

  const getProductAttributeOptions = useCallback(async () => {
    setOptions(() => ({ isLoading: true }));

    try {
      const result = await fetchProductAttributeOptions(productId, {
        page: controller.page+1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setOptions(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setOptions(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getProductAttributeOptions().catch(console.error);
  }, [controller]);

  const handleExitedDialog = () => {
    if (selectedOption) {
      setSelectedOption(null);
    }
  };

  const doDeleteOption = useCallback(async () => {
    try {
      return await deleteProductAttributeOption(productAttributeId, selectedOption?.id)
    } catch (e) {
      console.log(e)
    }
  }, [productAttributeId, selectedOption])

  const handleDeleteOption = () => {
    // DELETE VARIANT
    doDeleteOption().then(r => {
      getProductAttributeOptions().then()
    })

    handleCloseDeleteDialog();
  };

  useEffect(() => {
    setOptions(optionsProp);
  }, [optionsProp]);

  const handleEditOption = (option) => {
    setSelectedOption(option);
    handleOpenOptionDialog();
  }

  const handleCreateOption = () => {
    setSelectedOption(null);
    handleOpenOptionDialog();
  }

  const handleConfirmDeleteOption = (option) => {
    setSelectedOption(option);
    handleOpenDeleteDialog();
  }

  const displayUnavailable = options.length === 0;

  const handlePageChange = (newPage) => {
    setController({
      ...controller,
      page: newPage - 1
    });
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <TrCardHeader
          action={(
            <TrButton
              disabled={!can('product.attribute.options.can.create')}
              color="primary"
              onClick={handleCreateOption}
              variant="text"
            >
              Add
            </TrButton>
          )}
          title="Attribute Options"
        />
        <Divider />
        <Scrollbar>
          <ProductAttributeOptionsTable
            productAttributeType={productAttributeType}
            data={options.data ? options.data : []}
            onEdit={handleEditOption}
            onDelete={handleConfirmDeleteOption}
            page={controller.page + 1}
            pagesCount={options.paginationMeta ? options.paginationMeta.last_page : null}
            onPageChange={handlePageChange}
            onRowClicked={(selectedOption) => {
              can('product.attribute.options.can.see') && can('products.can.list') && setSelectedOption(selectedOption)
            }}
            selected={selectedOption}
          />

        </Scrollbar>
        {displayUnavailable && (
          <ResourceUnavailable
            onCreate={handleOpenOptionDialog}
            sx={{ m: 2 }}
          />
        )}
      </Card>
      <ProductAttributeOptionDialog
        productAttributeType={productAttributeType}
        onClose={handleCloseOptionDialog}
        onExited={handleExitedDialog}
        onoptionsChange={getProductAttributeOptions}
        onSuccess={getProductAttributeOptions}
        productAttributeId={productAttributeId}
        productAttributeOptionId={selectedOption ? selectedOption.id : null}
        open={optionDialogOpen}
        initialValues={selectedOption}
      />
      <ConfirmationDialog
        message={"Are you sure you want to delete this option? This can't be undone."}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleDeleteOption}
        open={deleteDialogOpen}
        title="Delete option"
        variant="error"
      />
    </>
  );
};

ProductAttributeOptions.propTypes = {
  options: PropTypes.array.isRequired,
  productId: PropTypes.string.isRequired
};
