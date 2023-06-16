import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Avatar,
  Box,
  Button, Card, CardContent, CardHeader,
  Container, Grid, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableRow,
  Typography
} from '@material-ui/core';
import {useMounted} from '../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../icons/arrow-left";
import {APIContext} from "../contexts/api-context";
import {Edit, ExpandMore, Email, ShoppingCart, Inventory, CalendarViewMonth} from "@material-ui/icons";
import {EmailClientContext} from "../contexts/email-client-context";
import Price from "../components/price";
import AddressCard from "../components/address/address-card";
import OrderCard from "../components/order/order-card";
import TransactionCard from "../components/transactions/transaction-card";
import PaymentSourceCard from "../components/payment-source/payment-source-card";
import NotesTriggerButton from "../components/notes/notes-trigger-button";

export const Customer = () => {
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

      if (mounted.current) {
        setCustomerData({
          isLoading: false,
          data: result.data.data
        })
      }
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

  const cb = () => {
    console.log('hello')
  }

  return (
    <>
      <Helmet>
        <title>Customer: List | {appName}</title>
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
              {customerData.data && <NotesTriggerButton notes={customerData.data.notes} noteableId={customerId} noteableType={"user"} updatedCallback={{cb: getCustomerData}}/>}
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
                  Email
                </Button>
              </Fragment>}
            </Box>
          </Box>
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
            {customerData.data && <Fragment>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}
                  >
                    <CardContent>
                      <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                        <ListItem>
                          <ListItemAvatar>
                            {customerData.data.avatar.url ?
                              <Avatar sx={{width: 36, height: 36}} alt={customerData.data.name}
                                      src={customerData.data.avatar.url}/> :
                              <Avatar>
                                {customerData.data.initials}
                              </Avatar>
                            }
                          </ListItemAvatar>
                          <ListItemText>
                            {customerData.data.name}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Email/></ListItemIcon>
                          <ListItemText>{customerData.data.email}</ListItemText>
                        </ListItem>
                        {customerData.data.phone && <ListItem>
                          <ListItemIcon><Email/></ListItemIcon>
                          <ListItemText>{customerData.data.phone}</ListItemText>
                        </ListItem>}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    <ListItem>
                      <ListItemIcon><ShoppingCart/></ListItemIcon>
                      <ListItemText>Total spent: <Price>{customerData.data.total_spent}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Inventory/></ListItemIcon>
                      <ListItemText>Orders: {customerData.data.total_orders}</ListItemText>
                    </ListItem>
                    {customerData.data.latest_order_date && <ListItem>
                      <ListItemIcon><CalendarViewMonth/></ListItemIcon>
                      <ListItemText>Last ordered: {customerData.data.latest_order_date}</ListItemText>
                    </ListItem>}
                  </List>
                </Grid>
              </Grid>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Addresses</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {customerData.data.address.map(address => (
                      <Grid key={address.id} item sm={6}>
                        <AddressCard address={address}/>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Orders</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {customerData.data.orders.map(order => (
                      <Grid key={order.id} item sm={6}>
                        <OrderCard order={order}/>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel2a-content"
                  id="panel3a-header"
                >
                  <Typography>Payments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {customerData.data.payments.map(transaction => (
                      <Grid key={transaction.id} item sm={6}>
                        <TransactionCard transaction={transaction}/>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel2a-content"
                  id="panel4a-header"
                >
                  <Typography>Payment Sources</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {customerData.data.payment_sources.map(paymentSource => (
                    <Grid key={paymentSource.id} item sm={6}>
                      <PaymentSourceCard paymentSource={paymentSource}/>
                    </Grid>
                  ))}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel2a-content"
                  id="panel5a-header"
                >
                  <Typography>Cart</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Cart</Typography>
                </AccordionDetails>
              </Accordion>
            </Fragment>}
          </Card>
        </Container>
      </Box>
    </>
  );
};
