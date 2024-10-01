import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {AuthContext} from "../../../contexts/oauth-context";
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductCategoryEditDialog} from "./product-category-edit-dialog";
import {DialogContext} from "../../../contexts/dialog-context";
import {useTranslation} from "react-i18next";

export const ProductCategoryMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {fetchProductCategory, deleteProductCategory, updateProductCategory} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productCategoryState, setProductCategoryState] = useState();
  const {can} = useContext(AuthContext)
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const { t } = useTranslation();

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
        enabled: status,
        clear_images: false
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
        <MenuItem disabled={!can('product.categories.can.update')}
                  onClick={handleEdit}>
          {t('Edit')}
        </MenuItem>
        <MenuItem disabled={!can('product.categories.can.update')}
                  onClick={() => handleStatusChange(enabled)}>
          {enabled ? t('Disable') : t('Enable')}
        </MenuItem>
        <MenuItem disabled={!can('product.categories.can.delete')}
                  onClick={handleDelete}>
          {t('Delete')}
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
