import React from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  Chip,
  Typography,
  Accordion, AccordionSummary, AccordionDetails
} from "@material-ui/core";
import {PropertyListItem} from "../property-list-item";
import expirableStatuses from "../../data/expirable-statuses.json"
import orderStatuses from "../../data/order-statuses.json"
import {format} from "date-fns";
import {lightNeutral} from "../../colors";
import {ExpandMore, Visibility} from "@material-ui/icons";
import {PropertyList} from "../property-list";
import {Link as RouterLink} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";

const VoucherCodeDetails = ({voucherCode}) => {

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
              <CardHeader
                action={(
                  <Button
                    color="primary"
                    onClick={() => console.log('edit')}
                    variant="text"
                  >
                    Edit
                  </Button>
                )}
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
                    <Chip sx={{fontSize: 34, padding: 4}} label={voucherCode.code} color="primary" />
                  </ListItem>
                  <ListItem>
                    <Typography
                      sx={{
                        color: lightNeutral[500]
                      }}
                      variant="caption"
                    >Used {voucherCode.used} times</Typography>
                  </ListItem>
                  <PropertyListItem label="Rule" value={voucherCode.value+" off"}/>
                  <PropertyListItem label="Valid" value={format(new Date(voucherCode.valid_from), 'dd MMM yyyy HH:mm')+" - "+format(new Date(voucherCode.valid_until), 'dd MMM yyyy HH:mm')}/>
                  <PropertyListItem label="Status" value={expirableStatuses[voucherCode.status].name}/>
                </List>
              </Box>
            </Card>
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
              <CardHeader
                title="Orders"
              />
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                {voucherCode.orders.length === 0 ? (
                  <Typography
                    sx={{
                      color: lightNeutral[500]
                    }}
                    variant="caption"
                  >There are no orders to show</Typography>
                ) : (
                  <>
                    {voucherCode.orders.map(o => <Accordion key={o.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <List>
                        <ListItem>
                          <Chip label={orderStatuses.find(s => s.value === o.status).label}
                                sx={{
                                  backgroundColor: orderStatuses.find(s => s.value === o.status).color
                                }}
                          />
                          <Button
                            color="primary"
                            component={RouterLink}
                            startIcon={<Visibility />}
                            to={"/orders/"+o.id}
                            variant="contained"
                            size={"small"}
                            sx={{
                              marginLeft: 1
                            }}
                          >
                            View
                          </Button>

                        </ListItem>
                        <ListItem>
                          <Typography sx={{
                            fontSize: 11
                          }}>{o.slug}
                          </Typography>
                        </ListItem>
                      </List>

                    </AccordionSummary>
                        <AccordionDetails>
                          <PropertyList>
                            <PropertyListItem label={"Customer"} value={o.user}/>
                            <PropertyListItem label={"Placed"} value={format(new Date(o.created_at), 'dd MMM yyyy HH:mm')}/>
                            <PropertyListItem label={"Original price"} value={o.original_price}/>
                            <PropertyListItem label={"Discount"} value={o.total_discount}/>
                            <PropertyListItem label={"Total"} value={o.total_price}/>
                          </PropertyList>
                        </AccordionDetails>
                    </Accordion>
                    )}
                  </>
                )}
              </Box>
            </Card>
          </Grid>
          </Grid>
      </Grid>
    </>
  )
}

export default VoucherCodeDetails