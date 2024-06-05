import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import { InputField } from './input-fields/input-field';
import { StatusBadge } from './status-badge';
import {useTranslation} from "react-i18next";

export const StatusSelect = (props) => {
  const { options, ...other } = props;
  const { t } = useTranslation();

  return (
    <InputField
      fullWidth
      select
      {...other}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
          value={option.value}
        >
          <StatusBadge
            color={option.color}
            sx={{
              backgroundColor: option.color,
              mr: 1
            }}
          />
          {t(option.label)}
        </MenuItem>
      ))}
    </InputField>
  );
};

StatusSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired
};
