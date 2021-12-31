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
import Price from "../price";

const Rule = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  padding: "0em 1em",
  lineHeight: '60px',
}));

export const DeliveryTypeInfo = (props) => {
  const { onEdit, data, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  const Order = styled(Paper)(({ theme }) => ({
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
          label="Price"
        >
          <Price>{data.price}</Price>
        </PropertyListItem>
        <PropertyListItem
          align={align}
          label="Rules"
        >
          <Rule variant={"outlined"} >
            <List dense>
              {data.rules.map(rule =>
                (
                  <ListItem key={rule.id} divider>
                    <ListItemText primary={rule.id} />
                  </ListItem>
                )
              )}
            </List>
          </Rule>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

DeliveryTypeInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
