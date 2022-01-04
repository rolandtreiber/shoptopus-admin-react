import PropTypes from 'prop-types';
import {Button, Card, CardHeader, Divider, Grid} from '@material-ui/core';
import {PropertyList} from '../property-list';
import {PropertyListItem} from '../property-list-item';
import Price from "../price";

// const Pending =     0;
// const Settled =     1;
// const Refunded =    2;
// const Rejected =    3;

const paymentStatusOptions = [
  {
    label: 'Pending',
    value: 0
  },
  {
    label: 'Settled',
    value: 1
  },
  {
    label: 'Refunded',
    value: 2
  },
  {
    label: 'Rejected',
    value: 3
  }
];

// const Stripe =      0;
// const PayPal =      1;
// const GooglePay =   2;
// const ApplePay =    3;

const paymentMethodOptions = [
  {
    label: 'Stripe',
    value: 0
  },
  {
    label: 'PayPal',
    value: 1
  },
  {
    label: 'GooglePay',
    value: 2
  },
  {
    label: 'ApplePay',
    value: 3
  }
];

export const OrderPayment = (props) => {
  const {onEdit, payment, ...other} = props;
  const paymentStatusOption = paymentStatusOptions
    .find((option) => option.value === payment.status);
  const paymentMethodOption = paymentMethodOptions
    .find((option) => option.value === payment.source.payment_method_id);

  return (
    <Card
      variant="outlined"
      {...other}
    >
      <CardHeader
        action={(
          <Button
            color="primary"
            onClick={onEdit}
            variant="text"
          >
            Edit
          </Button>
        )}
        title="Payment Details"
      />
      <Divider/>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Payment Reference"
              value={payment.payment_ref}
            />
            <PropertyListItem
              label="Payment Status"
              value={paymentStatusOption.label}
            />
          </PropertyList>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Payment Method"
              value={paymentMethodOption.label}
            />
            <PropertyListItem
              label="Amount"
            >
              <Price>{payment.amount}</Price>
            </PropertyListItem>
            {/*<PropertyListItem*/}
            {/*  label="Courier"*/}
            {/*  value={order.courier}*/}
            {/*/>*/}
            {/*<PropertyListItem*/}
            {/*  label="Tracking ID"*/}
            {/*  value={order.trackingCode}*/}
            {/*/>*/}
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

OrderPayment.propTypes = {
  onEdit: PropTypes.func,
  payment: PropTypes.object.isRequired
};
