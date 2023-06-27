import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button, Card, CardContent, CardHeader,
  Container, Divider, Grid, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Tab, Tabs,
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
import NotesTriggerButton from "../../components/notes/notes-trigger-button";
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

export const CustomerSingle = () => {
  const mounted = useMounted();
  const {language, appName} = useContext(SettingsContext)
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
        <title>Customer: {customerData.data ? customerData.data.name : 'Loading...'} | {appName}</title>
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
                to="/customers"
                variant="text"
              >
                Customers
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
                Customer{customerData.data && ": " + customerData.data.name}
                {customerData.data &&
                  <NotesTriggerButton notes={customerData.data.notes} noteableId={customerId} noteableType={"user"}
                                      updatedCallback={{cb: getCustomerData}}/>}
              </Typography>
              <Box sx={{flexGrow: 1}}/>
              <Button
                color="primary"
                onClick={() => getCustomerData().catch(err => console.log(err.message))}
                size="large"
                sx={{
                  marginLeft: 1
                }}
                variant="contained"
              >
                Reload
              </Button>
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
                  Email
                </Button>
              </Fragment>}
            </Box>
          </Box>
          <Grid container spacing={2}>
            {customerData.data &&
              <Fragment>
                <Grid item xs={12} md={8}>
                  <CustomerBasicInfo data={customerData.data}/>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomerQuickSummary data={customerData.data}/>
                </Grid>
                <Grid item xs={12}>
                  <Panel pv={0}>
                    <Box
                      sx={{
                        px: {
                          sm: 3
                        }
                      }}
                    >
                    <Tabs value={value} onChange={handleChange}>
                      <Tab label="Orders" {...a11yProps(0)} />
                      <Tab label="Addresses" {...a11yProps(1)} />
                      <Tab label="Payments" {...a11yProps(2)} />
                      <Tab label="Payment Sources" {...a11yProps(3)} />
                      <Tab label="Cart" {...a11yProps(4)} />
                      <Tab label="Ratings" {...a11yProps(5)} />
                      <Tab label="Logs" {...a11yProps(6)} />
                    </Tabs>
                    </Box>
                    <Divider/>
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
          {/*<Card*/}
          {/*  variant="outlined"*/}
          {/*  sx={{*/}
          {/*    display: 'flex',*/}
          {/*    flexDirection: 'column',*/}
          {/*    flexGrow: 1*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {customerData.data && */}
          {/*    <Fragment>*/}
          {/*    <Grid container spacing={2}>*/}
          {/*      <Grid item xs={8}>*/}
          {/*        <Card*/}
          {/*          sx={{*/}
          {/*            display: 'flex',*/}
          {/*            flexDirection: 'column',*/}
          {/*            flexGrow: 1*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <CardContent>*/}
          {/*            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>*/}
          {/*              <ListItem>*/}
          {/*                <ListItemAvatar>*/}
          {/*                  {customerData.data.avatar.url ?*/}
          {/*                    <Avatar sx={{width: 36, height: 36}} alt={customerData.data.name}*/}
          {/*                            src={customerData.data.avatar.url}/> :*/}
          {/*                    <Avatar>*/}
          {/*                      {customerData.data.initials}*/}
          {/*                    </Avatar>*/}
          {/*                  }*/}
          {/*                </ListItemAvatar>*/}
          {/*                <ListItemText>*/}
          {/*                  {customerData.data.name}*/}
          {/*                </ListItemText>*/}
          {/*              </ListItem>*/}
          {/*              <ListItem>*/}
          {/*                <ListItemIcon><Email/></ListItemIcon>*/}
          {/*                <ListItemText>{customerData.data.email}</ListItemText>*/}
          {/*              </ListItem>*/}
          {/*              {customerData.data.phone && <ListItem>*/}
          {/*                <ListItemIcon><Email/></ListItemIcon>*/}
          {/*                <ListItemText>{customerData.data.phone}</ListItemText>*/}
          {/*              </ListItem>}*/}
          {/*            </List>*/}
          {/*          </CardContent>*/}
          {/*        </Card>*/}
          {/*      </Grid>*/}
          {/*      <Grid item xs={4}>*/}
          {/*        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>*/}
          {/*          <ListItem>*/}
          {/*            <ListItemIcon><ShoppingCart/></ListItemIcon>*/}
          {/*            <ListItemText>Total spent: <Price>{customerData.data.total_spent}</Price></ListItemText>*/}
          {/*          </ListItem>*/}
          {/*          <ListItem>*/}
          {/*            <ListItemIcon><Inventory/></ListItemIcon>*/}
          {/*            <ListItemText>Orders: {customerData.data.total_orders}</ListItemText>*/}
          {/*          </ListItem>*/}
          {/*          {customerData.data.latest_order_date && <ListItem>*/}
          {/*            <ListItemIcon><CalendarViewMonth/></ListItemIcon>*/}
          {/*            <ListItemText>Last ordered: {customerData.data.latest_order_date}</ListItemText>*/}
          {/*          </ListItem>}*/}
          {/*        </List>*/}
          {/*      </Grid>*/}
          {/*    </Grid>*/}
          {/*    <Accordion>*/}
          {/*      <AccordionSummary*/}
          {/*        expandIcon={<ExpandMore/>}*/}
          {/*        aria-controls="panel1a-content"*/}
          {/*        id="panel1a-header"*/}
          {/*      >*/}
          {/*        <Typography>Addresses</Typography>*/}
          {/*      </AccordionSummary>*/}
          {/*      <AccordionDetails>*/}
          {/*        <Grid container spacing={2}>*/}
          {/*          {customerData.data.address.map(address => (*/}
          {/*            <Grid key={address.id} item sm={6}>*/}
          {/*              <AddressCard address={address}/>*/}
          {/*            </Grid>*/}
          {/*          ))}*/}
          {/*        </Grid>*/}
          {/*      </AccordionDetails>*/}
          {/*    </Accordion>*/}
          {/*    <Accordion>*/}
          {/*      <AccordionSummary*/}
          {/*        expandIcon={<ExpandMore/>}*/}
          {/*        aria-controls="panel2a-content"*/}
          {/*        id="panel2a-header"*/}
          {/*      >*/}
          {/*        <Typography>Orders</Typography>*/}
          {/*      </AccordionSummary>*/}
          {/*      <AccordionDetails>*/}
          {/*        <Grid container spacing={2}>*/}
          {/*          {customerData.data.orders.map(order => (*/}
          {/*            <Grid key={order.id} item sm={6}>*/}
          {/*              <OrderCard order={order}/>*/}
          {/*            </Grid>*/}
          {/*          ))}*/}
          {/*        </Grid>*/}
          {/*      </AccordionDetails>*/}
          {/*    </Accordion>*/}
          {/*    <Accordion>*/}
          {/*      <AccordionSummary*/}
          {/*        expandIcon={<ExpandMore/>}*/}
          {/*        aria-controls="panel2a-content"*/}
          {/*        id="panel3a-header"*/}
          {/*      >*/}
          {/*        <Typography>Payments</Typography>*/}
          {/*      </AccordionSummary>*/}
          {/*      <AccordionDetails>*/}
          {/*        <Grid container spacing={2}>*/}
          {/*          {customerData.data.payments.map(transaction => (*/}
          {/*            <Grid key={transaction.id} item sm={6}>*/}
          {/*              <TransactionCard transaction={transaction}/>*/}
          {/*            </Grid>*/}
          {/*          ))}*/}
          {/*        </Grid>*/}
          {/*      </AccordionDetails>*/}
          {/*    </Accordion>*/}
          {/*    <Accordion>*/}
          {/*      <AccordionSummary*/}
          {/*        expandIcon={<ExpandMore/>}*/}
          {/*        aria-controls="panel2a-content"*/}
          {/*        id="panel4a-header"*/}
          {/*      >*/}
          {/*        <Typography>Payment Sources</Typography>*/}
          {/*      </AccordionSummary>*/}
          {/*      <AccordionDetails>*/}
          {/*        {customerData.data.payment_sources.map(paymentSource => (*/}
          {/*          <Grid key={paymentSource.id} item sm={6}>*/}
          {/*            <PaymentSourceCard paymentSource={paymentSource}/>*/}
          {/*          </Grid>*/}
          {/*        ))}*/}
          {/*      </AccordionDetails>*/}
          {/*    </Accordion>*/}
          {/*    <Accordion>*/}
          {/*      <AccordionSummary*/}
          {/*        expandIcon={<ExpandMore/>}*/}
          {/*        aria-controls="panel2a-content"*/}
          {/*        id="panel5a-header"*/}
          {/*      >*/}
          {/*        <Typography>Cart</Typography>*/}
          {/*      </AccordionSummary>*/}
          {/*      <AccordionDetails>*/}
          {/*        <Typography>Cart</Typography>*/}
          {/*      </AccordionDetails>*/}
          {/*    </Accordion>*/}
          {/*  </Fragment>}*/}
          {/*</Card>*/}
        </Container>
      </Box>
    </>
  );
};
