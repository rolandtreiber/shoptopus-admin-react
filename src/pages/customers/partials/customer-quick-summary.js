import {List, ListItemText} from "@material-ui/core";
import Panel from "../../../components/common/panel";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {format} from "date-fns";
import Price from "../../../components/common/price";
import {useTranslation} from "react-i18next";

const CustomerQuickSummary = ({data}) => {
  const { t } = useTranslation();

  return (
    <Panel>
      <List>
        <ListItemGridKeyValue
          left={<ListItemText>{t("Latest Order")}</ListItemText>}
          right={
            <ListItemText>{data.latest_order_date ? format(new Date(data.latest_order_date), 'dd-MMM-yyyy HH:mm') : "N/A"}</ListItemText>}
        />
        <ListItemGridKeyValue
          left={<ListItemText>{t("Total Spent")}</ListItemText>}
          right={<ListItemText><Price>{data.total_spent}</Price></ListItemText>}
        />
        <ListItemGridKeyValue
          left={<ListItemText>{t("Orders")}</ListItemText>}
          right={<ListItemText>{data.total_orders}</ListItemText>}
        />
        <ListItemGridKeyValue
          left={<ListItemText>{t("Cart Items")}</ListItemText>}
          right={<ListItemText>{data.cart_item_count}</ListItemText>}
        />
        <ListItemGridKeyValue
          left={<ListItemText>{t("Last Seen")}</ListItemText>}
          right={
            <ListItemText>{data.last_seen ? format(new Date(data.last_seen), 'dd-MMM-yyyy HH:mm') : "N/A"}</ListItemText>}
        />
      </List>
    </Panel>
  )
}

export default CustomerQuickSummary