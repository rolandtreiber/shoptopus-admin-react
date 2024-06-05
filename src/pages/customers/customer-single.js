import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container, Divider, Grid, Tab, Tabs,
  Typography
} from '@material-ui/core';
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import {Email} from "@material-ui/icons";
import {EmailClientContext} from "../../contexts/email-client-context";
import NotesTriggerButton from "../../components/common-page-components/notes/notes-trigger-button";
import CustomerBasicInfo from "./partials/customer-basic-info";
import CustomerQuickSummary from "./partials/customer-quick-summary";
import Panel from "../../components/common/panel";
import CustomerTabOrders from "./partials/customer-tab-orders";
import CustomerTabAddresses from "./partials/customer-tab-addresses";
import CustomerTabPayments from "./partials/customer-tab-payments";
import CustomerTabPaymentSources from "./partials/customer-tab-payment-sources";
import CustomerTabCart from "./partials/customer-tab-cart";
import CustomerTabRatings from "./partials/customer-tab-ratings";
import CustomerTabLog from "./partials/customer-tab-log";
import {useTranslation} from "react-i18next";

export const CustomerSingle = () => {
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const {fetchCustomer} = useContext(APIContext)
  const [customerData, setCustomerData] = useState({isLoading: true})
  const {customerId} = useParams()
  const {
    setAddresses,
    setSubject,
    setInitialBody,
    showEmailClient
  } = useContext(EmailClientContext)[1]
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const setupEmailClient = (user) => {
    setInitialBody('<h1>Hello ' + user.name + '</h1>')
    setAddresses([user.name + ' <' + user.email + '>'])
    setSubject('Hello ' + user.name)
    showEmailClient()
  }

  const getCustomerData = useCallback(async () => {
    setCustomerData({isLoading: true})

    try {
      const result = await fetchCustomer(customerId)

      // if (mounted.current) {
      setCustomerData({
        isLoading: false,
        data: result.data.data
      })
      // }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setCustomerData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [])

  useEffect(() => {
    getCustomerData().catch(err => console.log(err.message))
  }, [])

  return (
    <>
      <Helmet>
        <title>{t("Customer")}: {customerData.data ? customerData.data.name : 'Loading...'} | {appName}</title>
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
                to="/admin/customers"
                variant="text"
              >
                {t("Customers")}
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
                {t("Customer")}{customerData.data && ": " + customerData.data.name}
                {customerData.data &&
                  <NotesTriggerButton notes={customerData.data.notes} noteableId={customerId} noteableType={"user"}
                                      updatedCallback={{cb: getCustomerData}}/>}
              </Typography>
              <Box sx={{flexGrow: 1}}/>
              {customerData.data && <Fragment>
                <Button
                  color="primary"
                  onClick={() => setupEmailClient(customerData.data)}
                  size="large"
                  sx={{
                    marginLeft: 1
                  }}
                  startIcon={<Email fontSize="small"/>}
                  variant="contained"
                >
                  {t("Email")}
                </Button>
              </Fragment>}
            </Box>
          </Box>
          <Grid container spacing={2}>
            {customerData.data &&
              <Fragment>
                <Grid item xs={12} md={6}>
                  <CustomerBasicInfo data={customerData.data}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomerQuickSummary data={customerData.data}/>
                </Grid>
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
                      <Tab label={t("Orders")} {...a11yProps(0)} />
                      <Tab label={t("Addresses")} {...a11yProps(1)} />
                      <Tab label={t("Payments")} {...a11yProps(2)} />
                      <Tab label={t("Payment Sources")} {...a11yProps(3)} />
                      <Tab label={t("Cart")} {...a11yProps(4)} />
                      <Tab label={t("Ratings")} {...a11yProps(5)} />
                      <Tab label={t("Logs")} {...a11yProps(6)} />
                    </Tabs>
                    </Box>
                    <Divider sx={{marginBottom: 2}}/>
                    {value === 0 && <CustomerTabOrders data={customerData.data.orders}/>}
                    {value === 1 && <CustomerTabAddresses data={customerData.data.address}/>}
                    {value === 2 && <CustomerTabPayments data={customerData.data.payments}/>}
                    {value === 3 && <CustomerTabPaymentSources data={customerData.data.payment_sources}/>}
                    {value === 4 && <CustomerTabCart data={customerData.data.cart}/>}
                    {value === 5 && <CustomerTabRatings data={customerData.data.ratings}/>}
                    {value === 6 && <CustomerTabLog data={customerData.data}/>}
                  </Panel>
                </Grid>
              </Fragment>
            }
          </Grid>
        </Container>
      </Box>
    </>
  );
};
