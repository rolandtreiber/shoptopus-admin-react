import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Card, CardHeader, Divider, Grid } from '@material-ui/core';
import { PropertyList } from '../../common/property-list/property-list';
import { PropertyListItem } from '../../common/property-list/property-list-item';

export const InvoicePayment = (props) => {
  const { invoice } = props;

  return (
    <Card variant="outlined">
      <CardHeader title="Payment" />
      <Divider />
      <Grid container>
        <Grid
          item
          md={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Date of Payment"
              value={format(invoice.paymentAt, 'dd MMM yyyy')}
            />
            <PropertyListItem
              label="Payment Method"
              value={invoice.paymentMethod}
            />
            <PropertyListItem
              label="TransactionSingle ID"
              value={invoice.transactionId}
            />
          </PropertyList>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="Amount"
              value={numeral(invoice.totalAmount).format(`${invoice.currencySymbol}0,0.00`)}
            />
            <PropertyListItem
              label="TransactionSingle Fees"
              value={numeral(invoice.transactionFees).format(`${invoice.currencySymbol}0,0.00`)}
            />
            <PropertyListItem
              label="Status"
              value={invoice.paymentStatus}
            />
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

InvoicePayment.propTypes = {
  invoice: PropTypes.object.isRequired
};
