import {Box, Card, Grid, List, ListItemText} from "@material-ui/core";
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import PaymentTypeLogo from "../../../components/common/payment-type-logo";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {useTheme} from "@material-ui/core/styles";
import PaymentTypes from "../../../data/payment-methods.json";
import {format} from "date-fns";

const CustomerTabPaymentSources = ({data}) => {
  const theme = useTheme()

  return (<Grid container spacing={2}>
    {data.length > 0 ? data.map(paymentSource => (<Grid item xs={12} lg={6}>
      <Card variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FullWidthSquareBox style={{
              borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.neutral[400]
            }}>
              <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                <PaymentTypeLogo type={paymentSource.payment_method_id} brand={paymentSource.brand}/>
              </Box>
            </FullWidthSquareBox>
          </Grid>
          <Grid item xs={8} sx={{position: "relative", paddingTop: 0}}>
            <List>
              <ListItemGridKeyValue
                left={<ListItemText>Name</ListItemText>}
                right={<ListItemText>{paymentSource.name}</ListItemText>}
              />
              <ListItemGridKeyValue
                left={<ListItemText>Payment method</ListItemText>}
                right={<ListItemText>{PaymentTypes[paymentSource.payment_method_id.toString()].name}</ListItemText>}
              />
              <ListItemGridKeyValue
                left={<ListItemText>Added</ListItemText>}
                right={<ListItemText>{format(new Date(paymentSource.added), 'dd-MMM-yyyy HH:mm')}</ListItemText>}
              />
              {paymentSource.payment_method_id === 1 && <>
              <ListItemGridKeyValue
                left={<ListItemText>Last 4 digits</ListItemText>}
                right={<ListItemText>**** **** **** {paymentSource.last_four}</ListItemText>}
              />
              <ListItemGridKeyValue
                left={<ListItemText>Expiry</ListItemText>}
                right={<ListItemText>{paymentSource.exp_month}/{paymentSource.exp_year}</ListItemText>}
              /></>}
            </List>
          </Grid>
        </Grid>
      </Card>
    </Grid>)) : (<Grid item xs={12}>
      <Card variant="outlined" style={{padding: 10}}>
        No payment sources to display
      </Card>
    </Grid>)}
  </Grid>)
}

export default CustomerTabPaymentSources