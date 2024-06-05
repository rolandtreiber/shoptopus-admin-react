import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { StatusBadge } from './status-badge';
import {TrTypography} from "./translated/translated-typography";

export const Status = (props) => {
  const { color, label, ...other } = props;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex'
      }}
      {...other}
    >
      <StatusBadge color={color} />
      <TrTypography
        sx={{
          color,
          ml: 1.75
        }}
        variant="body2"
      >
        {label}
      </TrTypography>
    </Box>
  );
};

Status.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
