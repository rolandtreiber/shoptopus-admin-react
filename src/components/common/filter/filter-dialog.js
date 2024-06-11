import { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle,
  Divider,
  IconButton
} from '@material-ui/core';
import { useFilters } from '../../../hooks/use-filters';
import { X as XIcon } from '../../../icons/x';
import TrButton from "../translated/translated-button";
import { FilterDialogItem } from './filter-dialog-item';
import {useTranslation} from "react-i18next";
import {TrTypography} from "../translated/translated-typography";

export const FilterDialog = (props) => {
  const { open, onClose, operators, properties, onApply, onClear, ...other } = props;
  const { t } = useTranslation();

  const {
    addFilter,
    clearFilters,
    filters,
    handleOperatorChange,
    handlePropertyChange,
    handleValueChange,
    removeFilter
  } = useFilters(properties, operators);

  const handleFiltersClear = () => {
    clearFilters();
    onClear?.();
    onClose?.();
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: 500,
          width: '100%'
        }
      }}
      {...other}
    >
      <DialogTitle
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          display: 'flex'
        }}
      >
        <TrTypography
          color="textPrimary"
          variant="inherit"
        >
          Filter
        </TrTypography>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <XIcon
            fontSize="small"
            sx={{ color: 'text.primary' }}
          />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {filters.map((filter, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            <FilterDialogItem
              filter={filter}
              index={index}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onOperatorChange={handleOperatorChange}
              onPropertyChange={handlePropertyChange}
              onValueChange={handleValueChange}
              operators={operators}
              properties={properties}
            />
            {filters.length > index + 1 && (
              <Divider
                sx={{
                  my: 2,
                  '& .MuiDivider-wrapper': {
                    p: 0
                  }
                }}
                textAlign="left"
              >
                <Chip
                  color="primary"
                  label="AND"
                  size="small"
                />
              </Divider>
            )}
          </Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <TrButton
          color="error"
          onClick={handleFiltersClear}
          variant="text"
        >
          Reset
        </TrButton>
        <TrButton
          color="primary"
          onClick={() => {
            onApply?.(filters);
            onClose?.();
          }}
          variant="contained"
        >
          Filter
        </TrButton>
      </DialogActions>
    </Dialog>
  );
};

FilterDialog.defaultProps = {
  open: false
};

FilterDialog.propTypes = {
  onApply: PropTypes.func,
  onClear: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  operators: PropTypes.array.isRequired,
  properties: PropTypes.array.isRequired
};
