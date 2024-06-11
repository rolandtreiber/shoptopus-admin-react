import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Card, Divider, Grid } from '@material-ui/core';
import { PropertyList } from '../../../components/common/property-list/property-list';
import { PropertyListItem } from '../../../components/common/property-list/property-list-item';
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const InvoiceDetails = (props) => {
  const { invoice } = props;

  return (
    <Card variant="outlined">
      <TrCardHeader title="Invoice Details" />
      <Divider />
      <Grid container>
        <Grid
          item
          md={6}
          xs={12}
        >
          <PropertyList>
            <PropertyListItem
              label="CustomerSingle Name"
              value={invoice.customerName}
            />
            <PropertyListItem
              label="Invoice Number"
              value={`#${invoice.id}`}
            />
            <PropertyListItem
              label="Invoice Date"
              value={format(invoice.issueDate, 'dd MMM yyyy')}
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
              label="Due Date"
              value={format(invoice.dueDate, 'dd MMM yyyy')}
            />
            <PropertyListItem
              label="Notes"
              value={`“${invoice.note}”`}
            />
          </PropertyList>
        </Grid>
      </Grid>
    </Card>
  );
};

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired
};
