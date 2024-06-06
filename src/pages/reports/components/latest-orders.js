import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Divider } from '@material-ui/core';
import { OrderPreviewItem } from '../../orders/components/order-preview-item';
import { OrderPreviewList } from '../../orders/components/order-preview-list';
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const LatestOrders = (props) => {
  const { orders } = props;

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <TrCardHeader
        action={(
          <TrButton
            color="primary"
            component={RouterLink}
            to="/orders"
            variant="text"
          >
            Go to orders
          </TrButton>
        )}
        title="Latest Orders"
      />
      <Divider />
      <OrderPreviewList>
        {orders.map((order, index) => (
          <OrderPreviewItem
            divider={orders.length > index + 1}
            key={order.id}
            order={order}
          />
        ))}
      </OrderPreviewList>
    </Card>
  );
};

LatestOrders.propTypes = {
  orders: PropTypes.array
};
