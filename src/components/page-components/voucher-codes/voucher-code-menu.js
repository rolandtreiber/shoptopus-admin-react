import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {DialogContext} from "../../../contexts/dialog-context";
import {VoucherCodeDialog} from "./voucher-code-dialog";

export const VoucherCodeMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {fetchVoucherCode, updateVoucherCode, deleteVoucherCode} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [entityState, setEntityState] = useState();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]

  const doDelete = useCallback( async (id) => {
    try {
      return await deleteVoucherCode(id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDelete = useCallback(async () => {
    const call = () => doDelete(id).then(result => {
      if (result.data?.status === "Success") {
        handleClose()
        onSuccess()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a voucher code.')
    showGenericDialog(true)
  }, [id])

  const doStatusChange = async (id, status) => {
    try {
      return await updateVoucherCode(id, {
        enabled: status
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleStatusChange = (currentStatus) => {
    const call = () => doStatusChange(id, !currentStatus).then(result => {
      if (result.status === 200) {
        handleClose()
        onSuccess()
      }
    })

    const text = currentStatus ? 'disable' : 'enable'
    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to '+text+' a voucher code.')
    showGenericDialog(true)
  };

  const getVoucherCode = useCallback(async () => {
    if (id) {
      try {
        const result = await fetchVoucherCode(id)

        if (mounted.current) {
          setEntityState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchVoucherCode])

  const handleEdit = () => {
    handleClose();
    getVoucherCode().then(() => {
      setOpenEditDialog(true)
    }).catch(e => console.log(e))
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
        <MenuItem onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(enabled)}>
          {enabled ? 'Disable' : 'Enable'}
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
      {entityState && <VoucherCodeDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        initialValues={entityState}
      />}
    </>
  );
};
