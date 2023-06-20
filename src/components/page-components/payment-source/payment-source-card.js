import React from "react";
import {
  Accordion, AccordionDetails,
  AccordionSummary,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import {ExpandMore, CreditCard} from "@material-ui/icons";
import {format} from "date-fns";

const PaymentSourceCard = ({paymentSource}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        aria-controls="panel1a-content"
        id={paymentSource.id}
      >
        <Typography>{paymentSource.brand}</Typography>
      </AccordionSummary>
      <AccordionDetails>

        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}>
          <List>
            <ListItem>
              <ListItemIcon><CreditCard/></ListItemIcon>
              <ListItemText>
                Brand: {paymentSource.brand}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Last 4: {paymentSource.last_four}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Expires: {paymentSource.exp_month}/{paymentSource.exp_year}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Added: {paymentSource.added}</ListItemText>
            </ListItem>
          </List>
        </Card>
      </AccordionDetails>
    </Accordion>
  )
}

export default PaymentSourceCard
