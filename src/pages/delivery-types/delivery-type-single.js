import {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Container} from '@material-ui/core';
import {ResourceError} from '../../components/common/placeholder/resource-error';
import {ResourceLoading} from '../../components/common/placeholder/resource-loading';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import {DeliveryTypeInfo} from "./components/delivery-type-info";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {DeliveryTypeDialog} from "./components/delivery-type-dialog";
import {DeliveryRuleDialog} from "./components/delivery-rule-dialog";
import {DialogContext} from "../../contexts/dialog-context";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const DeliveryTypeSingle = () => {
  const mounted = useMounted();
  const [data, setData] = useState({isLoading: true});
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const {fetchDeliveryType, deleteDeliveryRule} = useContext(APIContext)
  const {deliveryTypeId} = useParams();
  const {appName} = useContext(SettingsContext)
  const [openDeliveryRuleEditDialog, setOpenDeliveryRuleEditDialog] = useState(false)
  const [deliveryRuleData, setDeliveryRuleData] = useState()
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]

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

  const doDeleteDeliveryRule = useCallback(async (id) => {
    try {
      return await deleteDeliveryRule(deliveryTypeId, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDeleteDeliveryRule = useCallback(async (id) => {
    const call = () => doDeleteDeliveryRule(id).then(result => {
      if (result?.status === 200) {
        getData()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a delivery rule.')
    showGenericDialog(true)
  }, [])

  return (
    <>
      <Helmet>
        <title>Delivery Type | {appName}</title>
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
                to="/admin/delivery-types"
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
              <TrTypography
                color="textPrimary"
                variant="h4"
              >
                Delivery Type
              </TrTypography>
              <Box sx={{flexGrow: 1}}/>
            </Box>
            {data.data && <DeliveryTypeInfo
              onEdit={() => setOpenInfoDialog(true)}
              onCreateRule={() => {
                setDeliveryRuleData(null)
                setOpenDeliveryRuleEditDialog(true)
              }}
              onEditRule={(data) => {
                setDeliveryRuleData(data)
                setOpenDeliveryRuleEditDialog(true)
              }}
              onDeleteRule={(id) => handleDeleteDeliveryRule(id)}
              data={data.data}
            />}
            {data.isLoading && <ResourceLoading/>}
            {data.error && <ResourceError/>}
          </Box>
        </Container>
      </Box>
      {data && <DeliveryRuleDialog
        deliveryTypeId={deliveryTypeId}
        onClose={() => setOpenDeliveryRuleEditDialog(false)}
        open={openDeliveryRuleEditDialog}
        onSuccess={() => getData()}
        initialValues={deliveryRuleData}
      />}
      {data.data && <DeliveryTypeDialog
        onClose={() => setOpenInfoDialog(false)}
        open={openInfoDialog}
        onSuccess={() => getData()}
        initialValues={data.data}
      />}
    </>
  );
};
