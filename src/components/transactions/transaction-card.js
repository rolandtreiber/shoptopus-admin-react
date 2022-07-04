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
import {Status} from "../status";
import {CalendarToday, ExpandMore, LocalShipping, LocationCity, Payment} from "@material-ui/icons";
import Price from "../price";
import {useLanguage} from "../../hooks/use-language";
import {format} from "date-fns";


const typeVariants = [
  {
    color: 'success.main',
    label: 'Payment',
    value: 0
  },
  {
    color: 'error.main',
    label: 'Refund',
    value: 1
  }
];

const statusVariants = [
  {
    color: 'info.main',
    label: 'Pending',
    value: 0
  },
  {
    color: 'success.main',
    label: 'Settled',
    value: 1
  },
  {
    color: 'info.main',
    label: 'Refunded',
    value: 2
  },
  {
    color: 'error.main',
    label: 'Rejected',
    value: 3
  }
];

const TransactionCard = ({transaction}) => {
  const {getLang} = useLanguage()
  const typeVariant = typeVariants.find((variant) => variant.value
    === transaction.type);

  const statusVariant = statusVariants.find((variant) => variant.value
    === transaction.status);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        aria-controls="panel1a-content"
        id={transaction.id}
      >
        <Typography component={'span'}>{format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}<Status
          color={typeVariant.color}
          label={typeVariant.label}
        /></Typography>
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
              <ListItemIcon><Payment/></ListItemIcon>
              <ListItemText>
                <Price>{transaction.amount}</Price>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Description: {transaction.description}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Payment Ref: {transaction.payment_ref}</ListItemText>
            </ListItem>
          </List>
        </Card>
      </AccordionDetails>
    </Accordion>
  )
}

export default TransactionCard