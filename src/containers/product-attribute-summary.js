import {useState, useEffect, useCallback, useContext} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Grid } from '@material-ui/core';
import { ProductInfo } from '../components/product/product-info';
import { ProductInfoDialog } from '../components/product/product-info-dialog';
import { ProductStatus } from '../components/product/product-status';
import { ProductVariants } from '../components/product/product-variants';
import { ResourceError } from '../components/resource-error';
import { ResourceLoading } from '../components/resource-loading';
import { useMounted } from '../hooks/use-mounted';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {useParams} from "react-router-dom";
import {ProductCategoryInfo} from "../components/product-categories/product-category-info";
import ProductCategoriesTable from "../components/product-categories/product-categories-table";
import {ProductCategoryEditDialog} from "../components/product-categories/product-category-edit-dialog";
import {SettingsContext} from "../contexts/settings-context";
import {ProductAttributeInfo} from "../components/product-attributes/product-attribute-info";
import {ProductAttributeEditDialog} from "../components/product-attributes/product-attribute-edit-dialog";

export const ProductAttributeSummary = () => {
  const mounted = useMounted();
  const [data, setData] = useState({ isLoading: true });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchProductAttribute} = useContext(APIContext)
  const {productAttributeId} = useParams();
  const {language, appName} = useContext(SettingsContext)

  const getData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const {data: {data}} = await fetchProductAttribute(productAttributeId)
      const result = data;

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getData().catch(console.error);
  }, []);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const renderContent = () => {
    if (data.isLoading) {
      return <ResourceLoading />;
    }

    if (data.error) {
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
              <ProductAttributeInfo
                onEdit={() => setOpenInfoDialog(true)}
                data={data.data}
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
          </Grid>
        </Grid>
        <ProductAttributeEditDialog
          onClose={() => setOpenInfoDialog(false)}
          open={openInfoDialog}
          onSuccess={() => getData()}
          initialValues={data.data}
        />
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Product Attribute: Summary | {appName}</title>
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
