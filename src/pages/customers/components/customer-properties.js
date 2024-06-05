import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Card, Divider } from '@material-ui/core';
import { PropertyList } from '../../../components/common/property-list/property-list';
import { PropertyListItem } from '../../../components/common/property-list/property-list-item';
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const CustomerProperties = (props) => {
  const { customer, ...other } = props;

  return (
    <Card
      variant="outlined"
      {...other}
    >
      <TrCardHeader title="CustomerSingle Properties" />
      <Divider />
      <PropertyList>
        <PropertyListItem
          divider
          label="Tax Exempt"
          value={customer.isTaxExempt ? 'Yes' : 'No'}
        />
        <PropertyListItem
          divider
          label="Store Credit"
          value={`${numeral(customer.storeCredit).format('$0,0.00')} USD`}
        />
        <PropertyListItem
          divider
          label="Status"
          value={customer.status}
        />
        <PropertyListItem
          label="Signup"
          value={format(customer.createdAt, 'dd MM yyyy HH:mm')}
        />
      </PropertyList>
    </Card>
  );
};

CustomerProperties.propTypes = {
  customer: PropTypes.object.isRequired
};
