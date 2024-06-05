import {useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Grid } from '@material-ui/core';
import { ProductInfo } from '../components/product-info';
import { ResourceError } from '../../../components/common/placeholder/resource-error';
import { ResourceLoading } from '../../../components/common/placeholder/resource-loading';
import gtm from '../../../lib/gtm';
import ImagesDisplay from "../../../components/common/images/images-display";
import {ProductDialog} from "../components/product-dialog";
import { useOutletContext } from "react-router-dom";
import {ProductStatus} from "../components/product-status";
import {SettingsContext} from "../../../contexts/settings-context";

export const ProductSummary = () => {
  const [productState, reload] = useOutletContext()
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)

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
            <Grid
              item
              xs={12}
            >
              <ProductStatus onSuccess={() => reload.callback()} product={productState.data} />
            </Grid>
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
        <title>Product: Summary | {appName}</title>
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
