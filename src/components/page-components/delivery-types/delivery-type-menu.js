import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {DialogContext} from "../../../contexts/dialog-context";
import {DeliveryTypeDialog} from "./delivery-type-dialog";

export const DeliveryTypeMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {fetchDeliveryType, updateDeliveryType, deleteDeliveryType} = useContext(APIContext)
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
      return await deleteDeliveryType(id);
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
    setDescription('You are about to delete a delivery type.')
    showGenericDialog(true)
  }, [id])

  const doStatusChange = async (id, status) => {
    try {
      return await updateDeliveryType(id, {
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
    setDescription('You are about to '+text+' a delivery type.')
    showGenericDialog(true)
  };

  const getDeliveryType = useCallback(async () => {
    if (id) {
      try {
        const result = await fetchDeliveryType(id)

        if (mounted.current) {
          setEntityState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchDeliveryType])

  const handleEdit = () => {
    handleClose();
    getDeliveryType().then(() => {
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
      {entityState && <DeliveryTypeDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        initialValues={entityState}
      />}
    </>
  );
};
