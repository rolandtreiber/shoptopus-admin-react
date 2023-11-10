import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Button,
  Card,
  Divider,
} from '@material-ui/core';
import { useDialog } from '../../../hooks/use-dialog';
import { ConfirmationDialog } from '../../../components/modal/confirmation-dialog';
import { ResourceUnavailable } from '../../../components/common/placeholder/resource-unavailable';
import { Scrollbar } from '../../../components/common/scrollbar';
import { ProductVariantDialog } from '../../../components/page-components/product-variant/product-variant-dialog';
import {APIContext} from "../../../contexts/api-context";
import {getUrlFilters} from "../../../utils/apply-filters";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductVariantsTable} from "../../../components/page-components/product-variant/product-variants-table";
import {useOutletContext, useParams} from "react-router-dom";
import TrCardHeader from "../../../components/translated/TrCardHeader";

export const ProductVariants = (props) => {
  const { ...other } = props;
  const [productState] = useOutletContext()
  const {productId} = useParams();
  const mounted = useMounted();
  const [variantDialogOpen, handleOpenVariantDialog, handleCloseVariantDialog] = useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [variants, setVariants] = useState({
    isLoading:true
  });
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
        <TrCardHeader
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