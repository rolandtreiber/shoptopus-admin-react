import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Paper,
  useMediaQuery
} from '@material-ui/core';
import { PropertyList } from '../../common/property-list/property-list';
import { PropertyListItem } from '../../common/property-list/property-list-item';
import {useLanguage} from "../../../hooks/use-language";
import styled from "@emotion/styled";

export const ProductAttributeInfo = (props) => {
  const { onEdit, data, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  const types = {
    1: 'Text',
    2: 'Image',
    3: 'Color'
  }

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
          label="Enabled"
          value={data.enabled ? 'Yes' : 'No'}
        />
      </PropertyList>
    </Card>
  );
};

ProductAttributeInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
