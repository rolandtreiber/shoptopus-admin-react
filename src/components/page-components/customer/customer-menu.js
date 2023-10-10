import toast from 'react-hot-toast';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { usePopover } from '../../../hooks/use-popover';
import { DotsVertical as DotsVerticalIcon } from '../../../icons/dots-vertical';
import {useTranslation} from "react-i18next";

export const CustomerMenu = (props) => {
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const { t } = useTranslation();

  const handleDelete = () => {
    handleClose();
    toast.error('This action is not available on demo');
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        ref={anchorRef}
        {...props}
      >
        <DotsVerticalIcon fontSize="small" />
      </IconButton>
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
        <MenuItem onClick={handleDelete}>
          {t('Delete')}
        </MenuItem>
      </Menu>
    </>
  );
};
