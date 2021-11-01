import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Card, CardHeader, Divider, useMediaQuery } from '@material-ui/core';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import {useLanguage} from "../../hooks/use-language";

export const ProductInfo = (props) => {
  const { onEdit, product, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

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
        title="General Information"
      />
      <Divider />
      <PropertyList>
        <PropertyListItem
          align={align}
          label="Brand Name"
          value={'hello'}
        />
        <PropertyListItem
          align={align}
          label="ID"
          value={product.id}
        />
        <PropertyListItem
          align={align}
          label="Display Name"
          value={getLang(product.name)}
        />
        <PropertyListItem
          align={align}
          label="Description"
          value={getLang(product.description)}
        />
        <PropertyListItem
          align={align}
          label="Created"
          value={format(new Date(product.created_at), 'MMM dd, yyyy')}
        />
        <PropertyListItem
          align={align}
          label="Categories"
          value={product.categories.map(category => getLang(category.name)).join(', ')}
        />
        <PropertyListItem
          align={align}
          label="Tags"
          value={product.tags.map(tag => getLang(tag.name)).join(', ')}
        />
        <PropertyListItem
          align={align}
          label="Updated"
          value={format(new Date(product.updated_at), 'MMM dd, yyyy')}
        />
      </PropertyList>
    </Card>
  );
};

ProductInfo.propTypes = {
  onEdit: PropTypes.func,
  product: PropTypes.object.isRequired
};
