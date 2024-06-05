import {Card, Divider, Grid, List, ListItemText} from "@material-ui/core";
import {OrderStatus} from "../components/order-status";
import TransactionCard from "../../transactions/components/transaction-card";
import CustomerCard from "../../customers/components/customer-card";
import AddressCard from "../../../components/common-page-components/addresses/address-card";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import Price from "../../../components/common/price";
import {format} from "date-fns";
import {useTranslation} from "react-i18next";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const OrderTabInfo = ({data, updated}) => {
  const { t } = useTranslation();

  return (<Grid container spacing={2}>
    {data ? <>
      <Grid item xs={12} lg={7}>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <TrCardHeader title="General" />
          <Divider />
          <List>
            <ListItemGridKeyValue
              left={<ListItemText>{t("ID")}</ListItemText>}
              right={<ListItemText>{data.id}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>{t("Total")}</ListItemText>}
              right={<ListItemText><Price>{data.total_price}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>{t("Discount")}</ListItemText>}
              right={<ListItemText><Price>{data.total_discount}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>{t("Delivery")}</ListItemText>}
              right={<ListItemText><Price>{data.delivery_cost}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>{t("Voucher Code")}</ListItemText>}
              right={<ListItemText>{data.voucher_code ? data.voucher_code.code : "none"}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>{t("Placed At")}</ListItemText>}
              right={<ListItemText>{format(new Date(data.created_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>}
            />
          </List>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <TrCardHeader title={t("Customer")} />
          <CustomerCard data={data.user}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <TrCardHeader title={t("Payment")} />
          <TransactionCard payment={data.payments[0]}/>
        </Card>
      </Grid>
      <Grid item xs={12} lg={5}>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <OrderStatus order={data} updated={updated}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <TrCardHeader title={t("Address")} />
          <AddressCard vertical={true} address={data.address}/>
        </Card>
        <Card variant="outlined" style={{padding: 10, marginBottom: 10}}>
          <TrCardHeader title={t("Delivery")} />
        </Card>
      </Grid>
    </> : (<Grid item xs={12}>
      <Card variant="outlined" style={{padding: 10}}>
        {t("No data to display")}
      </Card>
    </Grid>)}
  </Grid>)
}

export default OrderTabInfo