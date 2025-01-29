import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {Card, Chip, Divider, useMediaQuery} from '@material-ui/core';
import { PropertyList } from '../../../components/common/property-list/property-list';
import { PropertyListItem } from '../../../components/common/property-list/property-list-item';
import TrButton from "../../../components/common/translated/translated-button";
import {useLanguage} from "../../../hooks/use-language";
import {useRetailPrice} from "../../../hooks/use-retail-price";
import {useContext} from "react";
import {AuthContext} from "../../../contexts/oauth-context";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const ProductInfo = (props) => {
  const { onEdit, product, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()
  const {getRetailPriceText} = useRetailPrice()
  const {can} = useContext(AuthContext)
  
  const align = mdDown ? 'vertical' : 'horizontal';

  return (
      <>
    <Card
      variant="outlined"
      {...other}
    >
      <TrCardHeader
        action={(
          <TrButton
            color="primary"
            disabled={!can('products.can.update')}
            onClick={onEdit}
            variant="text"
          >
            Edit
          </TrButton>
        )}
        title={"General Information"}
      />
      <Divider />
      <PropertyList>
        <PropertyListItem
            align={align}
            label="SKU"
            value={product.sku}
        />
        <PropertyListItem
            align={align}
            label="Slug"
            value={product.slug}
        />
        <PropertyListItem
          align={align}
          label="System ID"
          value={product.id}
        />
        <PropertyListItem
          align={align}
          label="Weight (g)"
          value={product.weight}
        />
        <PropertyListItem
          align={align}
          label="Price"
          value={getRetailPriceText(product)}
        />
        <PropertyListItem
            align={align}
            label="Current Stock"
            value={product.stock}
        />
        <PropertyListItem
            align={align}
            label="Total Sold"
            value={product.purchase_count}
        />
      </PropertyList>
    </Card>
        <Card
            sx={{
              mt: 2
            }}
            variant="outlined"
            {...other}
        >
          <TrCardHeader
              title="Product Details"
          />
          <Divider />
          <PropertyList>
            <PropertyListItem
              align={align}
              label="Display Name"
              value={getLang(product.name)}
            />
            <PropertyListItem
                align={align}
                label="Short Description"
                value={getLang(product.short_description)}
            />
            <PropertyListItem
              align={align}
              label="Description"
              value={getLang(product.description)}
            />
            {product.attributes.length > 0 && <PropertyListItem
                align={align}
                label="Attributes"
                value={product.attributes.map(attribute => {
                  return (<Chip
                      sx={{mr: 1}}
                      key={attribute.id}
                      color="primary"
                      label={getLang(attribute.name) + ' ('+getLang(attribute.option.name)+')'}
                      size="small"
                  />)
                })
                }
            />}
            {product.categories.length > 0 && <PropertyListItem
                align={align}
                label="Categories"
                value={product.categories.map(category => {
                  return (<Chip
                      sx={{mr: 1}}
                      key={category.id}
                      color="primary"
                      label={getLang(category.name)}
                      size="small"
                  />)
                })}
            />}
            {product.tags.length > 0 && <PropertyListItem
                align={align}
                label="Tags"
                value={product.tags.map(tag => {
                  return (<Chip
                      sx={{mr: 1}}
                      key={tag.id}
                      color="primary"
                      label={getLang(tag.name)}
                      size="small"
                  />)
                })}
            />}
            <PropertyListItem
              align={align}
              label="Created"
              value={format(new Date(product.created_at), 'MMM dd, yyyy')}
            />
            <PropertyListItem
              align={align}
              label="Updated"
              value={format(new Date(product.updated_at), 'MMM dd, yyyy')}
            />
          </PropertyList>
        </Card>
          </>
  );
};

ProductInfo.propTypes = {
  onEdit: PropTypes.func,
  product: PropTypes.object.isRequired
};
