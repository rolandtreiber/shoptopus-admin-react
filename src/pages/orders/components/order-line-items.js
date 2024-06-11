import PropTypes from 'prop-types';
import { Card, Divider } from '@material-ui/core';
import { OrderSummary } from './order-summary';
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const OrderLineItems = (props) => {
  const { order, ...other } = props;

  return (
    <Card
      variant="outlined"
      {...other}
    >
      <TrCardHeader title="Line Items" />
      <Divider />
      <OrderSummary order={order} />
    </Card>
  );
};

OrderLineItems.propTypes = {
  order: PropTypes.object
};
