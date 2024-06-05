import {Card, Grid} from "@material-ui/core";
import TransactionCard from "../../transactions/components/transaction-card";
import {useTranslation} from "react-i18next";

const CustomerTabPayments = ({data}) => {
  const { t } = useTranslation();

  return (<Grid container spacing={2}>
    {data.length > 0 ? data.map(payment => (<Grid key={payment.id} item xs={12} lg={6}>
      <TransactionCard payment={payment}/>
    </Grid>)) : (<Grid item xs={12}>
      <Card variant="outlined" style={{padding: 10}}>
        {t("No payments to display")}
      </Card>
    </Grid>)}
  </Grid>)
}

export default CustomerTabPayments