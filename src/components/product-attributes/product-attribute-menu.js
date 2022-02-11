import toast from 'react-hot-toast';
import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../icons/dots-vertical';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {ProductAttributeEditDialog} from "./product-attribute-edit-dialog";

export const ProductAttributeMenu = (props) => {
  const mounted = useMounted();
  const {productAttributeId, onSuccess} = props;
  const {fetchProductAttribute} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productAttributeState, setProductAttributeState] = useState();

  const getProductAttribute = useCallback(async () => {
    if (productAttributeId) {
      try {
        const result = await fetchProductAttribute(productAttributeId)

        if (mounted.current) {
          setProductAttributeState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchProductAttribute])

  const handleEdit = () => {
    handleClose();
    getProductAttribute().then(() => {
      setOpenEditDialog(true)
    }).catch(e => console.log(e))
  };

  const handleArchive = () => {
    handleClose();
    toast.error('This action is not available on demo');
  };

  const handleDelete = () => {
    handleClose();
    toast.error('This action is not available on demo');
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
        <MenuItem onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
      {productAttributeState && <ProductAttributeEditDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        initialValues={productAttributeState}
      />}
    </>
  );
};
