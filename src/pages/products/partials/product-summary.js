import {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Grid } from '@material-ui/core';
import { ProductInfo } from '../../../components/page-components/product/product-info';
// import { ProductStatus } from '../../components/page-components/product/product-status';
// import { ProductVariants } from '../../components/page-components/product/product-variants';
import { ResourceError } from '../../../components/common/placeholder/resource-error';
import { ResourceLoading } from '../../../components/common/placeholder/resource-loading';
import { useMounted } from '../../../hooks/use-mounted';
import gtm from '../../../lib/gtm';
// import {APIContext} from "../../contexts/api-context";
import {useParams} from "react-router-dom";
import ImagesDisplay from "../../../components/common/images/images-display";
import {ProductDialog} from "../../../components/page-components/product/product-dialog";
import { useOutletContext } from "react-router-dom";

export const ProductSummary = () => {
  const [productState, reload] = useOutletContext()
  const mounted = useMounted();
  // const [productState, setProductState] = useState({ isLoading: true });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  // const {fetchProduct} = useContext(APIContext)
  const {productId} = useParams();

  // const getProduct = useCallback(async () => {
  //   setProductState(() => ({ isLoading: true }));
  //
  //   try {
  //     const {data: {data}} = await fetchProduct(productId)
  //     const result = data;
  //
  //     if (mounted.current) {
  //       setProductState(() => ({
  //         isLoading: false,
  //         data: result
  //       }));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //
  //     if (mounted.current) {
  //       setProductState(() => ({
  //         isLoading: false,
  //         error: err.message
  //       }));
  //     }
  //   }
  // }, []);
  //
  // useEffect(() => {
  //   getProduct().catch(console.error);
  // }, []);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const renderContent = () => {
    if (productState.isLoading) {
      return <ResourceLoading />;
    }

    if (productState.error) {
      return <ResourceError />;
    }

    return (
      <>
        <Grid container spacing={3}>
          <Grid container item lg={8}
            spacing={3}
            sx={{
              height: 'fit-content',
              order: {
                md: 2,
                xs: 1
              }
            }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <ProductInfo
                onEdit={() => setOpenEditDialog(true)}
                product={productState.data}
              />
            </Grid>
            {/*<Grid*/}
            {/*  item*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <ProductVariants productId={productId} variants={{*/}
            {/*    data: productState.data?.variants*/}
            {/*  }} />*/}
            {/*</Grid>*/}
          </Grid>
          <Grid container item lg={4}
            spacing={3}
            sx={{
              height: 'fit-content',
              order: {
                md: 2,
                xs: 1
              }
            }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >

              <ImagesDisplay product={productState.data} images={productState.data.images} coverPhoto={productState.data.cover_photo} />
            </Grid>
            {/*<Grid*/}
            {/*  item*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <ProductStatus product={productState.data} />*/}
            {/*</Grid>*/}
          </Grid>
        </Grid>
        <ProductDialog
          onClose={() => setOpenEditDialog(false)}
          open={openEditDialog}
          onSuccess={() => reload.callback()}
          product={productState.data}
        />
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Product: Summary | Carpatin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      >
        {renderContent()}
      </Box>
    </>
  );
};
