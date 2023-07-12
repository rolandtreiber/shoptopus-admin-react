import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Container, Typography} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {DeliveryTypeInfo} from "../../components/page-components/delivery-types/delivery-type-info";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {DeliveryTypeDialog} from "../../components/page-components/delivery-types/delivery-type-dialog";

export const DeliveryTypeSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchDeliveryType} = useContext(APIContext)
  const {deliveryTypeId} = useParams();
  const {appName} = useContext(SettingsContext)

  const getData = useCallback(async () => {
    setData(() => ({isLoading: true}));

    try {
      const {data: {data}} = await fetchDeliveryType(deliveryTypeId)
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

  return (
    <>
      <Helmet>
        <title>Voucher Code: List | {appName}</title>
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
                to="/delivery-types"
                variant="text"
              >
                Delivery Types
              </Button>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Delivery Type
              </Typography>
              <Box sx={{flexGrow: 1}}/>
            </Box>
            {data.data && <DeliveryTypeInfo
              onEdit={() => setOpenInfoDialog(true)}
              data={data.data}
            />}
            {data.isLoading && <ResourceLoading/>}
            {data.error && <ResourceError/>}
          </Box>
        </Container>
      </Box>
      {data.data && <DeliveryTypeDialog
        onClose={() => setOpenInfoDialog(false)}
        open={openInfoDialog}
        onSuccess={() => getData()}
        initialValues={data.data}
      />}
    </>
  );
};
