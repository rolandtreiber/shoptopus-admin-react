import React from "react";
import {
  Box,
  Card, Grid, Link,
  List,
  ListItemText,
  Typography
} from "@material-ui/core";
import {NorthEast} from "@material-ui/icons";
import Price from "../../common/price";
import {format} from "date-fns";
import FullWidthSquareBox from "../../common/full-width-square-box";
import PaymentTypeLogo from "../../common/payment-type-logo";
import ListItemGridKeyValue from "../../common/list-item-grid-key-value";
import PaymentStatuses from "../../../data/payment-statuses.json";
import IconButton from "@material-ui/core/IconButton";
import {useTheme} from "@material-ui/core/styles";

const TransactionCard = ({payment}) => {
  const theme = useTheme()

  return (
    <Card variant="outlined">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{display: "flex", flexDirection: "row", alignItems: "flex-end", margin: 1}}>
            <Typography sx={{paddingBottom: 0}} variant={"h5"}><Price>{payment.amount}</Price></Typography>
            <Typography sx={{marginLeft: 2}}
                        variant={"body"}>{format(new Date(payment.created_at), 'dd-MMM-yyyy HH:mm')}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <FullWidthSquareBox style={{
            borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.neutral[400]
          }}>
            <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
              <PaymentTypeLogo type={payment.payment_method} brand={payment.brand}/>
            </Box>
          </FullWidthSquareBox>
        </Grid>
        <Grid item xs={8} sx={{position: "relative", paddingTop: 0}}>
          <List>
            <ListItemGridKeyValue
              left={<ListItemText>Status</ListItemText>}
              right={<ListItemText>{PaymentStatuses[payment.status].name}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Reference</ListItemText>}
              right={<ListItemText>{payment.payment_ref}</ListItemText>}
            />
            {payment.type === 1 && <>
              <ListItemGridKeyValue
                left={<ListItemText>Last 4 digits</ListItemText>}
                right={<ListItemText>**** **** **** {payment.last_four}</ListItemText>}
              />
              <ListItemGridKeyValue
                left={<ListItemText>Expiry</ListItemText>}
                right={<ListItemText>{payment.exp_month}/{payment.exp_year}</ListItemText>}
              />
            </>}
          </List>
          <Link href={'/transactions/' + payment.id} target={"_blank"}><IconButton
            sx={{position: "absolute", bottom: 10, right: 10}}><NorthEast/></IconButton></Link>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TransactionCard