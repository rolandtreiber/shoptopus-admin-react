import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { usePopover } from '../../../hooks/use-popover';
import { DotsVertical as DotsVerticalIcon } from '../../../icons/dots-vertical';
import {useTranslation} from "react-i18next";

export const OrderMenu = (props) => {
  const {order} = props
  const navigate = useNavigate();
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const { t } = useTranslation();

  const handleEdit = () => {
    handleClose();
    navigate('/admin/orders/'+order.id);
  };


  const handleViewNote = () => {
    handleClose();
    toast.error('Coming soon');
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
        <MenuItem onClick={handleEdit}>
          {t("View Order")}
        </MenuItem>
        <MenuItem onClick={handleViewNote}>
          {t("Leave a Note")}
        </MenuItem>
      </Menu>
    </>
  );
};
