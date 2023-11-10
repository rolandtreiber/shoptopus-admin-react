import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Card, CardContent, Container, Divider, Grid, Typography} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {ProductAttributeInfo} from "../../components/page-components/product-attributes/product-attribute-info";
import {
  ProductAttributeEditDialog
} from "../../components/page-components/product-attributes/product-attribute-edit-dialog";
import RightSidebarWrapper from "../../components/page-components/layout-elements/right-sidebar-wrapper";
import {ProductAttributeOptions} from "../../components/page-components/product-attributes/product-attribute-options";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {Pencil as PencilIcon} from "../../icons/pencil";
import ProductAttributeOptionProductsTree
  from "../../components/page-components/product-attributes/partials/product-attribute-option-products-tree";
import TrCardHeader from "../../components/translated/TrCardHeader";

export const ProductAttributeSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchProductAttribute, fetchProductAttributeOption} = useContext(APIContext)
  const {productAttributeId} = useParams();
  const {appName} = useContext(SettingsContext)
  const [selectedAttributeOption, setSelectedAttributeOption] = useState()
  const [attributeOptionData, setAttributeOptionData] = useState({isLoading: true})

  const getAttributeOptionData = useCallback(async () => {
    setAttributeOptionData(() => ({isLoading: true}));

    try {
      const {data: {data}} = await fetchProductAttributeOption(productAttributeId, selectedAttributeOption.id)
      const result = data;

      if (mounted.current) {
        setAttributeOptionData(() => ({
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
  }, [selectedAttributeOption])

  useEffect(() => {
    if (selectedAttributeOption) {
      getAttributeOptionData().catch(console.error);
    }
  }, [selectedAttributeOption]);

  const getData = useCallback(async () => {
    setData(() => ({isLoading: true}));

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
                to="/admin/product-attributes"
                variant="text"
              >
                Product Attributes
              </Button>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                marginBottom: 2
              }}
            >
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Product Attribute
              </Typography>
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
                  <ProductAttributeInfo
                    onEdit={() => setOpenInfoDialog(true)}
                    data={data.data}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <ProductAttributeOptions productAttributeType={data.data?.type} productAttributeId={productAttributeId} selectedOption={selectedAttributeOption} setSelectedOption={setSelectedAttributeOption} options={data.data.options} productId={data.data.id}/>
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
                      {(selectedAttributeOption) ?
                        (<>
                          {attributeOptionData.isLoading === true ? <Card variant="outlined" style={{padding: 10}}>
                            Loading
                          </Card> : <>
                            {attributeOptionData.data ? <ProductAttributeOptionProductsTree data={attributeOptionData.data.associated_product_variants}/> : <Card variant="outlined" style={{padding: 10}}>
                              No data to display
                            </Card>}
                          </>}

                        </>) :
                        <Card variant="outlined" style={{padding: 10}}>
                          No attribute option is selected
                        </Card>
                    }
                    </CardContent>
                  </Card>


                  {data.data?.image &&
                    <RightSidebarWrapper title={"Image"}>
                      <img style={{"width": "100%"}} src={data.data.image}/>
                    </RightSidebarWrapper>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <ProductAttributeEditDialog
            onClose={() => setOpenInfoDialog(false)}
            open={openInfoDialog}
            onSuccess={() => getData()}
            initialValues={data.data}
          />
        </Container>
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
