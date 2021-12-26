import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Divider,
  List, ListItem, ListItemAvatar, ListItemText,
  Paper,
  useMediaQuery
} from '@material-ui/core';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import {useLanguage} from "../../hooks/use-language";
import styled from "@emotion/styled";

export const ProductCategoryInfo = (props) => {
  const { onEdit, data, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  const Product = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: "0em 1em",
    lineHeight: '60px',
  }));

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
        {data.header_image && <PropertyListItem
          align={align}
          label="Header Image">
          <Paper variant={"outlined"}>
            <img style={{"width":"100%"}} src={data.header_image}/>
          </Paper>
        </PropertyListItem>
        }
        {data.menu_image && <PropertyListItem
          align={align}
          label="Menu Image">
          <Paper variant={"outlined"}>
            <img src={data.menu_image}/>
          </Paper>
        </PropertyListItem>
        }
        <PropertyListItem
          align={align}
          label="Name"
          value={getLang(data.name)}
        />
        <PropertyListItem
          align={align}
          label="Description"
          value={getLang(data.description)}
        />
        <PropertyListItem
          align={align}
          label="Status"
          value={data.enabled ? 'Enabled' : 'Disabled'}
        />
        <PropertyListItem
          align={align}
          label="Products"
          >
            <Product variant={"outlined"} >
              <List dense>
              {data.products.map(product =>
                (
                  <ListItem key={product.id} divider>
                    {product.cover_photo_url && <ListItemAvatar>
                      <Avatar
                        alt={getLang(product.name)}
                        src={product.cover_photo_url}
                        sx={{
                          width: 24,
                          height: 24
                        }}
                        variant="rounded"
                      />
                    </ListItemAvatar>}
                    <ListItemText primary={getLang(product.name)} />
                  </ListItem>
                )
              )}
              </List>
            </Product>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

ProductCategoryInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
