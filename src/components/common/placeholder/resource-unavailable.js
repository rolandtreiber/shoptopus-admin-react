import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
import { Plus as PlusIcon } from '../../../icons/plus';
import { QuestionMarkOutlined as QuestionMarkIcon } from '../../../icons/question-mark-outlined';
import TrButton from "../translated/translated-button";
import {TrTypography} from "../translated/translated-typography";

const ResourceUnavailableRoot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.neutral[100],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3)
}));

export const ResourceUnavailable = (props) => {
  const { onCreate, message, ...other } = props;

  return (
    <ResourceUnavailableRoot {...other}>
      <QuestionMarkIcon sx={{ color: 'text.secondary' }} />
      <TrTypography
        color="textSecondary"
        sx={{ mt: 2 }}
        variant="body2"
      >
        {message ? message : "There are not objects here yet."}
      </TrTypography>
      {onCreate && (
        <TrButton
          color="primary"
          onClick={onCreate}
          startIcon={<PlusIcon fontSize="small" />}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Create Object
        </TrButton>
      )}
    </ResourceUnavailableRoot>
  );
};

ResourceUnavailable.propTypes = {
  onCreate: PropTypes.func,
  message: PropTypes.string|null
};
