import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, CardHeader, Divider, Grid } from '@material-ui/core';
import { PropertyList } from '../../common/property-list/property-list';
import { PropertyListItem } from '../../common/property-list/property-list-item';
import TrCardHeader from "../../translated/TrCardHeader";

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
      <TrCardHeader
        action={(
          <Button
            color="primary"
            onClick={onEdit}
            variant="text"
          >
            Edit
          </Button>
        )}
        title="OrderSingle Info"
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
              label="CustomerSingle Name"
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
              <a target="_blank" href={order.address.composite.url} rel="noreferrer">{order.address.composite.text}</a>
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
