import toast from 'react-hot-toast';
import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../icons/dots-vertical';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {ProductCategoryEditDialog} from "./product-category-edit-dialog";
import {DialogContext} from "../../contexts/dialog-context";

export const ProductCategoryMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {fetchProductCategory, deleteProductCategory, updateProductCategory} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productCategoryState, setProductCategoryState] = useState();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]

  const getProductCategory = useCallback(async () => {
    if (id) {
      try {
        const result = await fetchProductCategory(id)

        if (mounted.current) {
          setProductCategoryState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [id])

  const handleEdit = () => {
    handleClose();
    getProductCategory().then(() => {
      setOpenEditDialog(true)
    }).catch(e => console.log(e))
  };

  const doDelete = useCallback( async (id) => {
    try {
      return await deleteProductCategory(id);
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
    setDescription('You are about to delete a product category.')
    showGenericDialog(true)
  }, [id])

  const doStatusChange = async (id, status) => {
    try {
      return await updateProductCategory(id, {
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
    setDescription('You are about to '+text+' a product category.')
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
      {productCategoryState && <ProductCategoryEditDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        initialValues={productCategoryState}
      />}
    </>
  );
};
