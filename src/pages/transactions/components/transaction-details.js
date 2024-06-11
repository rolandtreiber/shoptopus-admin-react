import {
  Box,
  Card,
  Divider,
  Grid,
  List, ListItem, ListItemText
} from "@material-ui/core";
import TrButton from "../../../components/common/translated/translated-button";
import transactionTypes from "../../../data/transaction-types.json"
import paymentMethods from "../../../data/payment-methods.json"
import {format} from "date-fns";
import { Visibility} from "@material-ui/icons";
import {Link as RouterLink} from "react-router-dom";
import Price from "../../../components/common/price";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const TransactionDetails = ({transaction}) => {

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item lg={8}
              spacing={3}
              sx={{ height: 'fit-content' }}
              xs={12}
        >
          <Grid
            item
            xs={12}
            marginTop={2}
          >
            <Card
              variant="outlined"
            >
              <TrCardHeader
                title="Details"
              />
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Amount</ListItemText>
                    <ListItemText sx={{flex: 3}}><h2 style={{fontSize: 34, padding: 4}} color="primary"><Price>{transaction.amount}</Price></h2></ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Type</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transactionTypes[transaction.type].name}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Payment Ref</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.payment_ref}</ListItemText>
                  </ListItem>
                  {transaction.method_ref && <ListItem>
                    <ListItemText sx={{flex: 1}}>Method Ref</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.method_ref}</ListItemText>
                  </ListItem>}
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Processed At</ListItemText>
                    <ListItemText sx={{flex: 3}}>{format(new Date(transaction.created_at), "dd MMM yyyy HH:mm")}</ListItemText>
                  </ListItem>
                </List>
              </Box>
            </Card>
            {transaction.payment_source && <Card
              variant="outlined"
              sx={{marginTop: 2}}
            >
              <TrCardHeader
                title="Source"
              />
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Type</ListItemText>
                    <ListItemText sx={{flex: 3}}>{paymentMethods[transaction.payment_source.payment_method_id].name}</ListItemText>
                  </ListItem>
                  {transaction.payment_source.exp_year && <ListItem>
                    <ListItemText sx={{flex: 1}}>Exp Year</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.payment_source.exp_year}</ListItemText>
                  </ListItem>}
                  {transaction.payment_source.exp_month && <ListItem>
                    <ListItemText sx={{flex: 1}}>Exp Month</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.payment_source.exp_month}</ListItemText>
                  </ListItem>}
                  {transaction.payment_source.brand && <ListItem>
                    <ListItemText sx={{flex: 1}}>Brand</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.payment_source.brand}</ListItemText>
                  </ListItem>}
                  {transaction.payment_source.last_four && <ListItem>
                    <ListItemText sx={{flex: 1}}>Last 4 digits</ListItemText>
                    <ListItemText sx={{flex: 3}}>**** **** **** {transaction.payment_source.last_four}</ListItemText>
                  </ListItem>}
                </List>
              </Box>
            </Card>}
            {transaction.user && <Card
              variant="outlined"
              sx={{marginTop: 2}}
            >
              <TrCardHeader
                action={
                  <TrButton
                    color="primary"
                    component={RouterLink}
                    to={"/admin/customers/"+transaction.user.id}
                    variant="text"
                    size={"small"}
                    sx={{
                      marginLeft: 1
                    }}
                  >
                    View
                  </TrButton>
                }
                title="User"
              />
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Name</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.user.name}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{flex: 1}}>Email</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.user.email}</ListItemText>
                  </ListItem>
                  {transaction.user.phone && <ListItem>
                    <ListItemText sx={{flex: 1}}>Phone</ListItemText>
                    <ListItemText sx={{flex: 3}}>{transaction.user.phone}</ListItemText>
                  </ListItem>}
                </List>
              </Box>
            </Card>}
          </Grid>
        </Grid>
        <Grid container item lg={4}
              spacing={3}
              sx={{ height: 'fit-content' }}
              xs={12}
        >
          <Grid
            item
            xs={12}
            marginTop={2}
          >
            <Card
              variant="outlined"
            >
              <TrCardHeader
                title="Paid for"
              />
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                {transaction.payable_type === "App\\Models\\Order" && <>
                  <List>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}><h2>Order</h2></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}>Original Price</ListItemText>
                      <ListItemText sx={{flex: 2}}><Price>{transaction.payable.original_price}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}>Sub Total</ListItemText>
                      <ListItemText sx={{flex: 2}}><Price>{transaction.payable.subtotal}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}>Total Discount</ListItemText>
                      <ListItemText sx={{flex: 2}}><Price>{transaction.payable.total_discount}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}>Delivery</ListItemText>
                      <ListItemText sx={{flex: 2}}><Price>{transaction.payable.delivery_cost}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText sx={{flex: 1}}>Total Price</ListItemText>
                      <ListItemText sx={{flex: 2}}><Price>{transaction.payable.total_price}</Price></ListItemText>
                    </ListItem>
                    <ListItem>
                      <TrButton
                        color="primary"
                        component={RouterLink}
                        startIcon={<Visibility />}
                        to={"/admin/orders/"+transaction.payable_id}
                        variant="contained"
                        size={"small"}
                      >
                        View
                      </TrButton>
                    </ListItem>
                  </List>
                </>}
                {/*{voucherCode.orders.length === 0 ? (*/}
                {/*  <TrTypography*/}
                {/*    sx={{*/}
                {/*      color: lightNeutral[500]*/}
                {/*    }}*/}
                {/*    variant="caption"*/}
                {/*  >There are no orders to show</TrTypography>*/}
                {/*) : (*/}
                {/*  <>*/}
                {/*    {voucherCode.orders.map(o => <Accordion key={o.id}>*/}
                {/*        <AccordionSummary*/}
                {/*          expandIcon={<ExpandMore />}*/}
                {/*          aria-controls="panel1a-content"*/}
                {/*          id="panel1a-header"*/}
                {/*        >*/}
                {/*          <List>*/}
                {/*            <ListItem>*/}
                {/*              <Chip label={orderStatuses.find(s => s.value === o.status).label}*/}
                {/*                    sx={{*/}
                {/*                      backgroundColor: orderStatuses.find(s => s.value === o.status).color*/}
                {/*                    }}*/}
                {/*              />*/}
                {/*              <TrButton*/}
                {/*                color="primary"*/}
                {/*                component={RouterLink}*/}
                {/*                startIcon={<Visibility />}*/}
                {/*                to={"/orders/"+o.id}*/}
                {/*                variant="contained"*/}
                {/*                size={"small"}*/}
                {/*                sx={{*/}
                {/*                  marginLeft: 1*/}
                {/*                }}*/}
                {/*              >*/}
                {/*                View*/}
                {/*              </TrButton>*/}

                {/*            </ListItem>*/}
                {/*            <ListItem>*/}
                {/*              <TrTypography sx={{*/}
                {/*                fontSize: 11*/}
                {/*              }}>{o.slug}*/}
                {/*              </TrTypography>*/}
                {/*            </ListItem>*/}
                {/*          </List>*/}

                {/*        </AccordionSummary>*/}
                {/*        <AccordionDetails>*/}
                {/*          <PropertyList>*/}
                {/*            <PropertyListItem label={"CustomerSingle"} value={o.user}/>*/}
                {/*            <PropertyListItem label={"Placed"} value={format(new Date(o.created_at), 'dd MMM yyyy HH:mm')}/>*/}
                {/*            <PropertyListItem label={"Original price"} value={o.original_price}/>*/}
                {/*            <PropertyListItem label={"Discount"} value={o.total_discount}/>*/}
                {/*            <PropertyListItem label={"Total"} value={o.total_price}/>*/}
                {/*          </PropertyList>*/}
                {/*        </AccordionDetails>*/}
                {/*      </Accordion>*/}
                {/*    )}*/}
                {/*  </>*/}
                {/*)}*/}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default TransactionDetails