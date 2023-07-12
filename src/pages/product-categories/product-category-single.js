import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Container, Typography} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ProductCategoryInfo} from "../../components/page-components/product-categories/product-category-info";
import {ProductCategoryEditDialog} from "../../components/page-components/product-categories/product-category-edit-dialog";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {Pencil as PencilIcon} from "../../icons/pencil";
import {SettingsContext} from "../../contexts/settings-context";

export const ProductCategorySingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
  const {appName} = useContext(SettingsContext)
  const {fetchProductCategory} = useContext(APIContext)
  const {productCategoryId} = useParams();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const getData = useCallback(async () => {
    setData(() => ({isLoading: true}));

    try {
      const {data: {data}} = await fetchProductCategory(productCategoryId)
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
        <Helmet>
          <title>Product Category | {appName}</title>
        </Helmet>
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
                  to="/product-categories"
                  variant="text"
                >
                  Product Categories
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
                  Product Category
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <Button
                  color="primary"
                  onClick={() => setOpenEditDialog(true)}
                  size="large"
                  startIcon={<PencilIcon fontSize="small"/>}
                  variant="contained"
                >
                  Edit
                </Button>
              </Box>

              <ProductCategoryInfo
                onEdit={() => setOpenEditDialog(true)}
                data={data.data}
              />
            </Box>
          </Container>
          <ProductCategoryEditDialog
            onClose={() => setOpenEditDialog(false)}
            open={openEditDialog}
            onSuccess={() => getData()}
            initialValues={data.data}
          />
        </Box>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Product Category: Summary | Carpatin Dashboard</title>
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
