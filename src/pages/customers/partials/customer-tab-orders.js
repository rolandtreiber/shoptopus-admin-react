import React from "react"
import {Box, Card, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@material-ui/core";
import statuses from "../../../data/order-statuses.json"
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import {useTheme} from "@material-ui/core/styles";
import {Email, Print, Download, NorthEast, Phone} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {format} from "date-fns";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import Price from "../../../components/common/price";
import {useLanguage} from "../../../hooks/use-language";

const CustomerTabOrders = ({data}) => {
  const theme = useTheme()
  const {getLang} = useLanguage()

  return (
    <Grid container spacing={2}>
      {data.length > 0 ? data.map(order => (
          <Grid item xs={12} lg={6}>
            <Card variant="outlined">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FullWidthSquareBox style={{
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.neutral[200],
                    minWidth: 210
                  }}>
                    <Box sx={{position: "absolute", top: 0, left: 10}}>
                      <p>{statuses[order.status].label}</p>
                    </Box>
                    <Grid container sx={{position: "absolute", bottom: 10, left: 10}}>
                      <Grid item xs={3}>
                        <IconButton aria-label="download" size={"small"}>
                          <Download/>
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <IconButton aria-label="email" size={"small"}>
                          <Email/>
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <IconButton aria-label="print" size={"small"}>
                          <Print/>
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <IconButton aria-label="locate" size={"small"}>
                          <NorthEast/>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </FullWidthSquareBox>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Placed</ListItemText>
                      }
                      right={
                        <ListItemText>{format(new Date(order.created_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>
                      }
                    />
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Total</ListItemText>
                      }
                      right={
                        <ListItemText>{order.total_price}</ListItemText>
                      }
                    />
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Discount</ListItemText>
                      }
                      right={
                        <ListItemText>{order.total_discount}</ListItemText>
                      }
                    />
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Delivery</ListItemText>
                      }
                      right={
                        <ListItemText><Price>{order.delivery_cost}</Price> ({getLang(order.delivery_type)}))</ListItemText>
                      }
                    />
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Town</ListItemText>
                      }
                      right={
                        <ListItemText>{order.town}</ListItemText>
                      }
                    />
                  </List>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No orders to display
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default CustomerTabOrders