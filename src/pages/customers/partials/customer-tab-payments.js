import React from "react"
import {Box, Card, Grid, Link, List, ListItemText, Typography} from "@material-ui/core";
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import IconButton from "@material-ui/core/IconButton";
import AmazonPayLogo from "../../../static/images/payment-types/amazon-pay.png"
import AmericanExpressLogo from "../../../static/images/payment-types/american-express.png"
import ApplePayLogo from "../../../static/images/payment-types/apple-pay.png"
import GooglePayLogo from "../../../static/images/payment-types/google-pay.png"
import MastercardLogo from "../../../static/images/payment-types/mastercard.png"
import VisaLogo from "../../../static/images/payment-types/visa.png"
import PayPalLogo from "../../../static/images/payment-types/paypal.png"
import GenericLogo from "../../../static/images/payment-types/generic.png"
import {useTheme} from "@material-ui/core/styles";
import PaymentTypes from "../../../data/payment-methods.json"
import PaymentStatuses from "../../../data/payment-statuses.json"
import Price from "../../../components/common/price";
import {format} from "date-fns";
import {NorthEast} from "@material-ui/icons";

const CustomerTabPayments = ({data}) => {
  const theme = useTheme()

  const renderPaymentTypeLogo = (type, brand) => {
    switch (PaymentTypes[type]?.name) {
      case "Stripe":
        switch (brand) {
          case "visa":
            return <img alt="visa-logo" src={VisaLogo} width={"100%"}/>
          case "mastercard":
            return <img alt="mastercard-logo" src={MastercardLogo} width={"100%"}/>
          case "american express":
            return <img alt="american-express-logo" src={AmericanExpressLogo} width={"100%"}/>
        }
      case "PayPal":
        return <img alt="paypal-logo" src={PayPalLogo} width={"100%"}/>
      case "GooglePay":
        return <img alt="google-pay-logo" src={GooglePayLogo} width={"100%"}/>
      case "ApplePay":
        return <img alt="apple-pay-logo" src={ApplePayLogo} width={"100%"}/>
      case "AmazonPay":
        return <img alt="amazon-pay-logo" src={AmazonPayLogo} width={"100%"}/>
      default:
        return <img alt="generic-logo" src={GenericLogo} width={"100%"}/>
    }
  }

  return (
    <Grid container spacing={2}>
      {data.length > 0 ? data.map(payment => (
          <Grid item xs={12} lg={6}>
            <Card variant="outlined">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{display: "flex", flexDirection: "row", alignItems: "flex-end", margin: 1}}>
                    <Typography sx={{paddingBottom: 0}} variant={"h5"}><Price>{payment.amount}</Price></Typography>
                    <Typography sx={{marginLeft: 2}}
                                variant={"body"}>{format(new Date(payment.created_at), 'dd-MMM-yyyy HH:mm')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FullWidthSquareBox style={{
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.neutral[400],
                    minWidth: 210
                  }}>
                    <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                      {renderPaymentTypeLogo(payment.payment_method, payment.brand)}
                    </Box>
                  </FullWidthSquareBox>
                </Grid>
                <Grid item xs={6} sx={{position: "relative", paddingTop: 0}}>
                  <List>
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Status</ListItemText>
                      }
                      right={
                        <ListItemText>{PaymentStatuses[payment.status].name}</ListItemText>
                      }
                    />
                    <ListItemGridKeyValue
                      left={
                        <ListItemText>Reference</ListItemText>
                      }
                      right={
                        <ListItemText>{payment.payment_ref}</ListItemText>
                      }
                    />
                    {payment.type === 1 &&
                      <>
                        <ListItemGridKeyValue
                          left={
                            <ListItemText>Last 4 digits</ListItemText>
                          }
                          right={
                            <ListItemText>**** **** **** {payment.last_four}</ListItemText>
                          }
                        />
                        <ListItemGridKeyValue
                          left={
                            <ListItemText>Expiry</ListItemText>
                          }
                          right={
                            <ListItemText>{payment.exp_month}/{payment.exp_year}</ListItemText>
                          }
                        />
                      </>
                    }
                  </List>
                  <Link href={'#'} target={"_blank"}><IconButton sx={{position: "absolute", bottom: 10, right: 10}}><NorthEast/></IconButton></Link>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No payments to display
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default CustomerTabPayments