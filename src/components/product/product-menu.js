import toast from 'react-hot-toast';
import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../icons/dots-vertical';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {ProductDialog} from "./product-dialog";

export const ProductMenu = (props) => {
  const mounted = useMounted();
  const {productId, onSuccess} = props;
  const {fetchProduct} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productState, setProductState] = useState();

  const getProduct = useCallback(async () => {
    if (productId) {
      try {
        const result = await fetchProduct(productId)

        if (mounted.current) {
          setProductState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [productId])

  const handleEdit = () => {
    handleClose();
    getProduct().then(() => {
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
        <MenuItem onClick={handleArchive}>
          Archive
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
      <ProductDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        product={productState}
      />
    </>
  );
};
