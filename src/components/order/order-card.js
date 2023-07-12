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
import {Status} from "../common/status";
import {CalendarToday, ExpandMore, LocalShipping, LocationCity, Payment} from "@material-ui/icons";
import Price from "../common/price";
import {useLanguage} from "../../hooks/use-language";
import {format} from "date-fns";


const statusVariants = [
  {
    color: 'info.main',
    label: 'Paid',
    value: 1
  },
  {
    color: 'warning.main',
    label: 'Processing',
    value: 2
  },
  {
    color: 'info.main',
    label: 'In Transit',
    value: 3
  },
  {
    color: 'success.main',
    label: 'Completed',
    value: 4
  },
  {
    color: 'warning.main',
    label: 'On Hold',
    value: 5
  },
  {
    color: 'error.main',
    label: 'Cancelled',
    value: 6
  }
];

const OrderCard = ({order}) => {
  const {getLang} = useLanguage()
  const statusVariant = statusVariants.find((variant) => variant.value
    === parseInt(order.status));

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        aria-controls="panel1a-content"
        id={order.id}
      >
        <Typography component={'span'}>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}<Status
          color={statusVariant.color}
          label={statusVariant.label}
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
                <Price>{order.total_price}</Price>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon><LocalShipping/></ListItemIcon>
              <ListItemText><Price>{order.delivery_cost}</Price> - ({getLang(order.delivery_type)})</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon><CalendarToday/></ListItemIcon>
              <ListItemText>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon><LocationCity/></ListItemIcon>
              <ListItemText>{order.town}</ListItemText>
            </ListItem>
          </List>
        </Card>
      </AccordionDetails>
    </Accordion>
  )
}

export default OrderCard