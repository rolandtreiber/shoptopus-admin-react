import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import toast from 'react-hot-toast';
import {Box, Button, Container, Divider, Grid, Skeleton, Tab, Tabs, Typography} from '@material-ui/core';
import {ActionsMenu} from '../../components/common/actions/actions-menu';
import {useMounted} from '../../hooks/use-mounted';
import {ArrowLeft as ArrowLeftIcon} from '../../icons/arrow-left';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import NotesTriggerButton from "../../components/notes/notes-trigger-button";
import {SettingsContext} from "../../contexts/settings-context";
import {Email} from "@material-ui/icons";
import {EmailClientContext} from "../../contexts/email-client-context";
import Panel from "../../components/common/panel";
import OrderTabInfo from "./partials/order-tab-info";
import OrderTabItems from "./partials/order-tab-items";
import OrderTabEmails from "./partials/order-tab-emails";

export const OrderSingle = () => {
  const mounted = useMounted();
  const [orderState, setOrderState] = useState({isLoading: true});
  const {fetchOrder} = useContext(APIContext)
  const {orderId} = useParams()
  const {appName} = useContext(SettingsContext)
  const {
    setAddresses,
    setSubject,
    setInitialBody,
    showEmailClient
  } = useContext(EmailClientContext)[1]
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const getOrder = useCallback(async (setIsLoading = true) => {
    setIsLoading === true && setOrderState(() => ({isLoading: true}));

    try {
      const result = await fetchOrder(orderId);

      if (mounted.current) {
        setOrderState(() => ({
          isLoading: false,
          data: result.data.data
        }));
        console.log(result.data.data)
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setOrderState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getOrder().catch(console.error);
  }, []);

  useEffect(() => {
    gtm.push({event: 'page_view'});
  }, []);

  const handleUpdateStatus = () => {
    toast.success('Status update action handled');
  };

  const handleAddTrackingInformation = () => {
    toast.success('Add tracking information action handled');
  };

  const handleDownloadPackingOrder = () => {
    toast.success('Download packing order action handled');
  };

  const handleDownloadInvoice = () => {
    toast.success('Download invoice action handled');
  };

  const actions = [
    {
      label: 'Update Status',
      onClick: handleUpdateStatus
    },
    {
      label: 'Add tracking information',
      onClick: handleAddTrackingInformation
    },
    {
      label: 'Download packing order',
      onClick: handleDownloadPackingOrder
    },
    {
      label: 'Download invoice',
      onClick: handleDownloadInvoice
    }
  ];

  const setupEmailClient = (user) => {
    setInitialBody('<h1>Hello ' + user.name + '</h1>')
    setAddresses([user.name + ' <' + user.email + '>'])
    setSubject('Hello ' + user.name)
    showEmailClient()
  }

  return (
    <>
      <Helmet>
        <title>Order: {orderState.data ? orderState.data.slug : 'Loading...'} | {appName}</title>
      </Helmet>
      {orderState.isLoading ? (
        <Box sx={{py: 4}}>
          <Skeleton height={42}/>
          <Skeleton/>
          <Skeleton/>
        </Box>) : (
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
                  to="/orders"
                  variant="text"
                >
                  Orders
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
                  Order{orderState.data && ": " + orderState.data.slug}
                  {orderState.data &&
                    <NotesTriggerButton notes={orderState.data.notes} noteableId={orderId} noteableType={"order"}
                                        updatedCallback={{cb: getOrder}}/>}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <Button
                  color="primary"
                  onClick={() => getOrder(false).catch(err => console.log(err.message))}
                  size="large"
                  sx={{
                    marginLeft: 1
                  }}
                  variant="contained"
                >
                  Reload
                </Button>
                {orderState.data && <Fragment>
                  <Button
                    color="primary"
                    onClick={() => setupEmailClient(orderState.data.user)}
                    size="large"
                    sx={{
                      marginLeft: 1,
                      marginRight: 1
                    }}
                    startIcon={<Email fontSize="small"/>}
                    variant="contained"
                  >
                    Email
                  </Button>
                  <ActionsMenu actions={actions}/>
                </Fragment>}
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Fragment>
                <Grid item xs={12} style={{paddingBottom: 10}}>
                  <Panel pv={0} pb={1}>
                    <Box
                      sx={{
                        px: {
                          sm: 3
                        }
                      }}
                    >
                      <Tabs value={value} onChange={handleChange}>
                        <Tab label="Info" {...a11yProps(0)} />
                        <Tab label="Items" {...a11yProps(1)} />
                        <Tab label="Emails" {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                    <Divider sx={{marginBottom: 2}}/>
                    {value === 0 && <OrderTabInfo updated={() => getOrder(false)} data={orderState.data}/>}
                    {value === 1 && <OrderTabItems data={orderState.data.products}/>}
                    {value === 2 && <OrderTabEmails data={orderState.data.id}/>}
                  </Panel>
                </Grid>

              </Fragment>
            </Grid>
          </Container>
        </Box>
            )}
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    backgroundColor: 'background.default',*/}
      {/*    flexGrow: 1*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Container*/}
      {/*    maxWidth="lg"*/}
      {/*    sx={{*/}
      {/*      display: 'flex',*/}
      {/*      flexDirection: 'column',*/}
      {/*      height: '100%'*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {renderContent()}*/}
      {/*  </Container>*/}
      {/*</Box>*/}
    </>
  );
};
