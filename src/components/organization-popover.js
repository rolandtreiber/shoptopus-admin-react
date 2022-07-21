import PropTypes from 'prop-types';
import {
  Box,
  ButtonBase,
  Typography
} from '@material-ui/core';

export const OrganizationPopover = (props) => {
  const { currentOrganization, organizations, onOrganizationChange, sx, ...other } = props;

  return (
    <>
      <ButtonBase
        href={process.env.REACT_APP_STOREFRONT_URL}
        target={"_blank"}
        sx={{
          borderRadius: 1,
          display: 'flex',
          p: 1,
          width: 180,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          },
          ...sx
        }}
        {...other}
      >
        <Typography
          color="textSecondary"
          sx={{
            color: 'primary.contrastText',
            mr: 3
          }}
          variant="subtitle2"
        >
          {currentOrganization.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </ButtonBase>
    </>
  );
};

OrganizationPopover.propTypes = {
  currentOrganization: PropTypes.object.isRequired,
  onOrganizationChange: PropTypes.func,
  organizations: PropTypes.array.isRequired,
  sx: PropTypes.object
};
