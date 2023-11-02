import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { usePopover } from '../../hooks/use-popover';
import { ChevronDown as ChevronDownIcon } from '../../icons/chevron-down';
import {useTranslation} from "react-i18next";

export const BulkActionsMenu = (props) => {
  const { disabled, selectedCount, menuItems } = props;
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const { t } = useTranslation();

  return (
    <>
      <Button
        color="primary"
        disabled={disabled}
        onClick={handleOpen}
        ref={anchorRef}
        size="large"
        startIcon={<ChevronDownIcon />}
        variant="outlined"
        sx={{
          display: selectedCount > 0 ? 'flex' : 'none',
          order: {
            sm: 1,
            xs: 2
          }
        }}
      >
        {t("Bulk Actions")}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {
          menuItems && menuItems.map(menuItem => (
            <MenuItem disabled={menuItem.disabled === true} key={menuItem.name} onClick={() => {
              menuItem.callback()
              handleClose()
            }}>
              {`${t(menuItem.name)} (${selectedCount})`}
            </MenuItem>
          ))
        }
      </Menu>
    </>
  );
};

BulkActionsMenu.propTypes = {
  disabled: PropTypes.bool,
  onArchive: PropTypes.func,
  onDelete: PropTypes.func,
  selectedCount: PropTypes.number
};
