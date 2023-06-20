import {useState, useEffect, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { useDialog } from '../../../hooks/use-dialog';
import { ConfirmationDialog } from '../../modal/confirmation-dialog';
import { ResourceUnavailable } from '../../common/placeholder/resource-unavailable';
import { Scrollbar } from '../../common/scrollbar';
import { ProductVariantDialog } from '../product-variant/product-variant-dialog';
import {APIContext} from "../../../contexts/api-context";
import {getUrlFilters} from "../../../utils/apply-filters";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductVariantsTable} from "../product-variant/product-variants-table";

export const ProductVariants = (props) => {
  const { variants: variantsProp, productId, ...other } = props;
  const mounted = useMounted();
  const [variantDialogOpen, handleOpenVariantDialog, handleCloseVariantDialog] = useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [variants, setVariants] = useState(variantsProp);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const {deleteProductVariant, fetchProductVariants} = useContext(APIContext)
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'updated_at',
    view: 'all'
  });

  const getProductVariants = useCallback(async () => {
    setVariants(() => ({ isLoading: true }));

    try {
      const result = await fetchProductVariants(productId, {
        page: controller.page+1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setVariants(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setVariants(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getProductVariants().catch(console.error);
  }, [controller]);

  const handleExitedDialog = () => {
    if (selectedVariant) {
      setSelectedVariant(null);
    }
  };

  const doDeleteVariant = useCallback(async (productId, variantId) => {
    try {
      return await deleteProductVariant(productId, variantId)
    } catch (e) {
      console.log(e)
    }
  })

  const handleDeleteVariant = () => {
    // DELETE VARIANT
    doDeleteVariant(productId, selectedVariant.id).then(r => {
      getProductVariants().then()
    })

    handleCloseDeleteDialog();
  };

  useEffect(() => {
    setVariants(variantsProp);
  }, [variantsProp]);

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    handleOpenVariantDialog();
  }

  const handleCreateVariant = (variant) => {
    setSelectedVariant(null);
    handleOpenVariantDialog();
  }

  const handleConfirmDeleteVariant = (variant) => {
    setSelectedVariant(variant);
    handleOpenDeleteDialog();
  }

  const displayUnavailable = variants.length === 0;

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
        <CardHeader
          action={(
            <Button
              color="primary"
              onClick={handleCreateVariant}
              variant="text"
            >
              Add
            </Button>
          )}
          title="Variants"
        />
        <Divider />
        <Scrollbar>
          <ProductVariantsTable
            data={variants.data ? variants.data : []}
            onEdit={handleEditVariant}
            onDelete={handleConfirmDeleteVariant}
            page={controller.page + 1}
            pagesCount={variants.paginationMeta ? variants.paginationMeta.last_page : null}
            onPageChange={handlePageChange}
          />

        </Scrollbar>
        {displayUnavailable && (
          <ResourceUnavailable
            onCreate={handleOpenVariantDialog}
            sx={{ m: 2 }}
          />
        )}
      </Card>
      <ProductVariantDialog
        onClose={handleCloseVariantDialog}
        onExited={handleExitedDialog}
        onVariantsChange={getProductVariants}
        onSuccess={getProductVariants}
        productId={productId}
        open={variantDialogOpen}
        variant={selectedVariant}
      />
      <ConfirmationDialog
        message="Are you sure you want to delete this variant? This can't be undone."
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleDeleteVariant}
        open={deleteDialogOpen}
        title="Delete variant"
        variant="error"
      />
    </>
  );
};

ProductVariants.propTypes = {
  variants: PropTypes.object.isRequired,
  productId: PropTypes.string.isRequired
};
