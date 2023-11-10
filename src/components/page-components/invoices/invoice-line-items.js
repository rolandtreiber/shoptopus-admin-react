import PropTypes from 'prop-types';
import { Card, Divider } from '@material-ui/core';
import { InvoiceTable } from './invoice-table';
import TrCardHeader from "../../translated/TrCardHeader";

export const InvoiceLineItems = (props) => {
  const { invoice } = props;

  return (
    <Card variant="outlined">
      <TrCardHeader title="Line Items" />
      <Divider />
      <InvoiceTable invoice={invoice} />
    </Card>
  );
};

InvoiceLineItems.propTypes = {
  invoice: PropTypes.object.isRequired
};
