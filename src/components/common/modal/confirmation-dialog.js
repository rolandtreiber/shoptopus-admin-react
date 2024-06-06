import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent, DialogTitle,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import {useTranslation} from "react-i18next";
import TrButton from "../translated/translated-button";
import {TrTypography} from "../translated/translated-typography";

const icons = {
  error: (
    <ErrorIcon
      color="error"
      fontSize="large"
    />
  ),
  warning: (
    <WarningIcon
      color="warning"
      fontSize="large"
    />
  ),
  info: (
    <InfoIcon
      color="info"
      fontSize="large"
    />
  )
};

export const ConfirmationDialog = (props) => {
  const { message, onCancel, onConfirm, open, title, variant, ...other } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      onClose={onCancel}
      open={open}
      PaperProps={{
        sx: {
          width: '100%'
        }
      }}
      {...other}
    >
      <DialogTitle
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        {icons[variant]}
        <TrTypography
          color="inherit"
          sx={{ ml: 2 }}
          variant="inherit"
        >
          {title}
        </TrTypography>
      </DialogTitle>
      <DialogContent>
        <TrTypography
          color="textPrimary"
          variant="body1"
        >
          {message}
        </TrTypography>
      </DialogContent>
      <DialogActions>
        <TrButton
          color="primary"
          onClick={onCancel}
          variant="text"
        >
          Cancel
        </TrButton>
        <TrButton
          color="primary"
          onClick={onConfirm}
          variant="contained"
        >
          Confirm
        </TrButton>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.defaultProps = {
  open: false
};

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['error', 'warning', 'info'])
};
