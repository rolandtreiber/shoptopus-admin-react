import toast from 'react-hot-toast';
import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductDialog} from "./product-dialog";
import {DialogContext} from "../../../contexts/dialog-context";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../../contexts/oauth-context";

export const ProductMenu = (props) => {
  const mounted = useMounted();
  const {productId, onSuccess} = props;
  const {fetchProduct, deleteProduct} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productState, setProductState] = useState();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const { t } = useTranslation();
  const {can} = useContext(AuthContext)
  
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

  const doDeleteProduct = useCallback( async (id) => {
    try {
      return await deleteProduct(productId);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDelete = useCallback(async () => {
    const call = () => doDeleteProduct(productId).then(result => {
      if (result.data?.status === "Success") {
        onSuccess()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a product.')
    showGenericDialog(true)
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
          {t('Edit')}
        </MenuItem>
        <MenuItem onClick={handleArchive}>
          {t('Archive')}
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={!can("products.can.delete")}>
          {t('Delete')}
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
