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

export const ProductAttributeInfo = (props) => {
  const { onEdit, data, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  const types = [
    'Text', 'Image', 'Color'
  ];

  const Option = styled(Paper)(({ theme }) => ({
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
        {data.image && <PropertyListItem
          align={align}
          label="Header Image">
          <Paper variant={"outlined"}>
            <img style={{"width":"100%"}} src={data.image}/>
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
          label="Type"
          value={types[data.type]}
        />
        <PropertyListItem
          align={align}
          label="Status"
          value={data.enabled ? 'Enabled' : 'Disabled'}
        />
        <PropertyListItem
          align={align}
          label="Options"
        >
          <Option variant={"outlined"} >
            <List dense>
              {data.options.map(option =>
                (
                  <ListItem key={option.id} divider>
                    {option.image && <ListItemAvatar>
                      <Avatar
                        alt={getLang(option.name)}
                        src={option.image}
                        sx={{
                          width: 24,
                          height: 24
                        }}
                        variant="rounded"
                      />
                    </ListItemAvatar>}
                    <ListItemText primary={getLang(option.name)} />
                  </ListItem>
                )
              )}
            </List>
          </Option>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

ProductAttributeInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
