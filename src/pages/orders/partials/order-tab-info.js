import {Card, CardHeader, Divider, Grid, List, ListItemText} from "@material-ui/core";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {OrderStatus} from "../../../components/order/order-status";
import Price from "../../../components/common/price";
import {format} from "date-fns";
import TransactionCard from "../../../components/page-components/transactions/transaction-card";
import CustomerCard from "../../../components/page-components/customer/customer-card";
import AddressCard from "../../../components/page-components/addresses/address-card";

const OrderTabInfo = ({data, updated}) => {
  return (<Grid container spacing={2}>
    {data ? <>
      <Grid item xs={12} lg={7}>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <CardHeader title="General" />
          <Divider />
          <List>
            <ListItemGridKeyValue
              left={<ListItemText>ID</ListItemText>}
              right={<ListItemText>{data.id}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Total</ListItemText>}
              right={<ListItemText><Price>{data.total_price}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Discount</ListItemText>}
              right={<ListItemText><Price>{data.total_discount}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Delivery</ListItemText>}
              right={<ListItemText><Price>{data.delivery_cost}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Voucher Code</ListItemText>}
              right={<ListItemText>{data.voucher_code ? data.voucher_code : "none"}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Placed At</ListItemText>}
              right={<ListItemText>{format(new Date(data.created_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>}
            />
          </List>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <CardHeader title="Customer" />
          <CustomerCard data={data.user}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <CardHeader title="Payment" />
          <TransactionCard payment={data.payments[0]}/>
        </Card>
      </Grid>
      <Grid item xs={12} lg={5}>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <OrderStatus order={data} updated={updated}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <CardHeader title="Address" />
          <AddressCard vertical={true} address={data.address}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <CardHeader title="Delivery" />
        </Card>
      </Grid>
    </> : (<Grid item xs={12}>
      <Card variant="outlined" style={{padding: 10}}>
        No data to display
      </Card>
    </Grid>)}
  </Grid>)
}

export default OrderTabInfo