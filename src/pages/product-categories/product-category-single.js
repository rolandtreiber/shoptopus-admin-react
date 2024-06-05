import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Container} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ProductCategoryInfo} from "./components/product-category-info";
import {ProductCategoryEditDialog} from "./components/product-category-edit-dialog";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {Pencil as PencilIcon} from "../../icons/pencil";
import {SettingsContext} from "../../contexts/settings-context";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const ProductCategorySingle = () => {
  const {appName} = useContext(SettingsContext)
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
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
  }, [productCategoryId]);

  useEffect(() => {
    getData().catch(console.error);
  }, [productCategoryId]);

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
                  to="/admin/product-categories"
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
                <TrTypography
                  color="textPrimary"
                  variant="h4"
                >
                  Product Category
                </TrTypography>
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
        <title>Product Category | {appName}</title>
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
