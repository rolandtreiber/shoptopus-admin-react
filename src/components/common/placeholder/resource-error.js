import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
import { ExclamationOutlined as ExclamationIcon } from '../../../icons/exclamation-outlined';
import { Refresh as RefreshIcon } from '../../../icons/refresh';
import TrButton from "../translated/translated-button";
import {TrTypography} from "../translated/translated-typography";

const ResourceErrorRoot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.neutral[100],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3)
}));

export const ResourceError = (props) => {
  const { error, onReload, ...other } = props;

  return (
    <ResourceErrorRoot {...other}>
      <ExclamationIcon sx={{ color: 'text.secondary' }} />
      <TrTypography
        color="textSecondary"
        sx={{ mt: 2 }}
        variant="body2"
      >
        {error || 'Error loading data, please try again.'}
      </TrTypography>
      {onReload && (
        <TrButton
          color="primary"
          onClick={onReload}
          startIcon={<RefreshIcon fontSize="small" />}
          sx={{ mt: 2 }}
          variant="text"
        >
          Reload Data
        </TrButton>
      )}
    </ResourceErrorRoot>
  );
};

ResourceError.propTypes = {
  error: PropTypes.string,
  onReload: PropTypes.func
};
