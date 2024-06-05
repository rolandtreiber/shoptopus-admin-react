import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import { OrderPreviewItem } from '../../orders/components/order-preview-item';
import { OrderPreviewList } from '../../orders/components/order-preview-list';
import { ResourceUnavailable } from '../../../components/common/placeholder/resource-unavailable';
import {TrTypography} from "../../../components/common/translated/translated-typography";

export const CustomerLatestOrders = (props) => {
  const { orders, ...other } = props;

  return (
    <div {...other}>
      <TrTypography
        color="textPrimary"
        variant="h6"
        sx={{ mb: 3 }}
      >
        Latest Orders
      </TrTypography>
      {orders.length
        ? (
          <Card variant="outlined">
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
        )
        : <ResourceUnavailable />}
    </div>
  );
};

CustomerLatestOrders.defaultProps = {
  orders: []
};

CustomerLatestOrders.propTypes = {
  orders: PropTypes.array
};
