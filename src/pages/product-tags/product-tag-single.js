import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Grid } from '@material-ui/core';
import { ResourceError } from '../../components/common/placeholder/resource-error';
import { ResourceLoading } from '../../components/common/placeholder/resource-loading';
import { useMounted } from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {ProductTagEditDialog} from "../../components/page-components/product-tags/product-tag-edit-dialog";
import {ProductTagInfo} from "../../components/page-components/product-tags/product-tag-info";

export const ProductTagSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({ isLoading: true });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchProductTag} = useContext(APIContext)
  const {productTagId} = useParams();
  const {appName} = useContext(SettingsContext)

  const getData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const {data: {data}} = await fetchProductTag(productTagId)
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
              <ProductTagInfo
                onEdit={() => setOpenInfoDialog(true)}
                data={data.data}
              />
            </Grid>
          </Grid>
          <Grid container item lg={4} spacing={3} sx={{height: 'fit-content', order: {md: 2, xs: 1} }} xs={12}>
          </Grid>
        </Grid>
        <ProductTagEditDialog
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
        <title>Product Tag: Summary | {appName}</title>
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
