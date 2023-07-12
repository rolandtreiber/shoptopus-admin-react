import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import {Box, Grid} from '@material-ui/core';
import { ResourceError } from '../../components/common/placeholder/resource-error';
import { ResourceLoading } from '../../components/common/placeholder/resource-loading';
import { useMounted } from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {ProductAttributeInfo} from "../../components/page-components/product-attributes/product-attribute-info";
import {ProductAttributeEditDialog} from "../../components/page-components/product-attributes/product-attribute-edit-dialog";
import RightSidebarWrapper from "../../components/page-components/layout-elements/right-sidebar-wrapper";
import {ProductAttributeOptions} from "../../components/page-components/product-attributes/product-attribute-options";

export const ProductAttributeSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({ isLoading: true });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchProductAttribute} = useContext(APIContext)
  const {productAttributeId} = useParams();
  const {appName} = useContext(SettingsContext)

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
            <Grid
              item
              xs={12}
            >
              <ProductAttributeOptions options={data.data.options} productId={data.data.id}/>
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
            {data.data?.image &&
              <RightSidebarWrapper title={"Image"}>
                <img style={{"width":"100%"}} src={data.data.image}/>
              </RightSidebarWrapper>
            }
          </Grid>
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
