import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {DialogContext} from "../../../contexts/dialog-context";
import {useTranslation} from "react-i18next";

export const ProductTagMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {deleteProductTag, updateProductTag} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const { t } = useTranslation();

  const doDelete = useCallback( async (id) => {
    try {
      return await deleteProductTag(id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDelete = useCallback(async () => {
    const call = () => doDelete(id).then(result => {
      if (result.data?.status === "Success") {
        onSuccess()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a product tag.')
    showGenericDialog(true)
  }, [id])

  const doStatusChange = async (id, status) => {
    try {
      return await updateProductTag(id, {
        enabled: status
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleStatusChange = (currentStatus) => {
    const call = () => doStatusChange(id, !currentStatus).then(result => {
      if (result.status === 200) {
        onSuccess()
      }
    })

    const text = currentStatus ? 'disable' : 'enable'
    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to '+text+' a product tag.')
    showGenericDialog(true)
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        ref={anchorRef}
      >
        <DotsVerticalIcon fontSize="small"/>
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
        <MenuItem onClick={() => handleStatusChange(enabled)}>
          {enabled ? t('Disable') : t('Enable')}
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {t("Delete")}
        </MenuItem>
      </Menu>
    </>
  );
};
