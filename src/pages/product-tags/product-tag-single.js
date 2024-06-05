import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Card, CardContent, Container, Divider, Grid} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {ProductTagEditDialog} from "./components/product-tag-edit-dialog";
import {ProductTagInfo} from "./components/product-tag-info";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {Pencil as PencilIcon} from "../../icons/pencil";
import ProductTagProductListItem
  from "./partials/product-tag-product-list-item";
import TrCardHeader from "../../components/common/translated/translated-card-header";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const ProductTagSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchProductTag} = useContext(APIContext)
  const {productTagId} = useParams();
  const {appName} = useContext(SettingsContext)

  const getData = useCallback(async () => {
    setData(() => ({isLoading: true}));

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
    gtm.push({event: 'page_view'});
  }, []);

  const renderContent = () => {
    if (data.isLoading) {
      return <ResourceLoading/>;
    }

    if (data.error) {
      return <ResourceError/>;
    }

    return (
      <>
        <Box
          sx={{
            backgroundColor: 'background.default',
            flexGrow: 1
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >

            <Box sx={{py: 4}}>
              <Box sx={{mb: 2}}>
                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<ArrowLeftIcon/>}
                  to="/admin/product-tags"
                  variant="text"
                >
                  Product Tags
                </Button>
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  marginBottom: 2
                }}
              >
                <TrTypography
                  color="textPrimary"
                  variant="h4"
                >
                  Product Tag
                </TrTypography>
                <Box sx={{flexGrow: 1}}/>
                <Button
                  color="primary"
                  onClick={() => setOpenInfoDialog(true)}
                  size="large"
                  startIcon={<PencilIcon fontSize="small"/>}
                  variant="contained"
                >
                  Edit
                </Button>
              </Box>

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
                <Grid container item lg={4} spacing={3} sx={{height: 'fit-content', order: {md: 2, xs: 1}}} xs={12}>

                  <Grid
                    item
                    xs={12}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        mb: 2
                      }}
                    >
                      <TrCardHeader
                        title="Products"
                      />
                      <Divider/>
                      <CardContent>
                        {data.data?.products && data.data.products.map(product => <ProductTagProductListItem key={product.id} product={product}/>)}
                      </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </Grid>
            </Box>

          </Container>
        </Box>
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
