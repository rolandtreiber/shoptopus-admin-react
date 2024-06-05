import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Divider,
  Paper,
  useMediaQuery
} from '@material-ui/core';
import { PropertyList } from '../../../components/common/property-list/property-list';
import { PropertyListItem } from '../../../components/common/property-list/property-list-item';
import {useLanguage} from "../../../hooks/use-language";
import styled from "@emotion/styled";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const Product = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  padding: "0em 1em",
  lineHeight: '60px',
}));

export const ProductTagInfo = (props) => {
  const { onEdit, data, ...other } = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

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
      <TrCardHeader
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
        {data.badge && <PropertyListItem
          align={align}
          label="Badge">
          <Paper variant={"outlined"}>
            <img style={{"width":"100%"}} src={data.badge}/>
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
          label="Display Badge"
          value={data.display_badge ? 'Yes' : 'No'}
        />
      </PropertyList>
    </Card>
  );
};

ProductTagInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
