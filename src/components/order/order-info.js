import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, CardHeader, Divider, Grid } from '@material-ui/core';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import {Link} from "react-router-dom";

// const Paid =        1;
// const Processing =  2;
// const InTransit =   3;
// const Completed =   4;
// const OnHold =      5;
// const Cancelled =   6;

const statusVariants = [
  {
    label: 'Awaiting Payment',
    value: 1
  },
  {
    label: 'Paid',
    value: 2
  },
  {
    label: 'Processing',
    value: 3
  },
  {
    label: 'InTransit',
    value: 4
  },
  {
    label: 'Completed',
    value: 5
  },
  {
    label: 'On Hold',
    value: 6
  },
  {
    label: 'Cancelled',
    value: 7
  }
];

export const OrderInfo = (props) => {
  const { order, onEdit, ...other } = props;
  const statusVariant = statusVariants.find((variant) => variant.value === order.status);

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
        title="Order Info"
      />
      <Divider />
      <Box
        sx={{
          px: 3,
          py: 1.5
        }}
      >
        <Avatar
          sx={{
            height: 64,
            width: 64
          }}
          variant="rounded"
        >
          {`${order.user.first_name[0]} ${order.user.last_name[0]}`}
        </Avatar>
      </Box>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Customer Name"
              value={`${order.user.name}`}
            />
            <PropertyListItem
              label="Email Address"
              value={order.user.email}
            />
            <PropertyListItem
              label="Phone Number"
              value={order.user.phone}
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
              label="Status"
              value={statusVariant.label}
            />
            <PropertyListItem
              label="Address"
            >
              <a target="_blank" href={order.address.composite.url}>{order.address.composite.text}</a>
            </PropertyListItem>
            <PropertyListItem
              label="Country"
              value={order.address.country}
            />
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

OrderInfo.propTypes = {
  onEdit: PropTypes.func,
  order: PropTypes.object.isRequired
};
