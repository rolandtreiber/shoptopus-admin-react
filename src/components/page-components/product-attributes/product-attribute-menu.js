import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {ProductAttributeEditDialog} from "./product-attribute-edit-dialog";
import {DialogContext} from "../../../contexts/dialog-context";
import {useTranslation} from "react-i18next";

export const ProductAttributeMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess, enabled} = props;
  const {fetchProductAttribute, updateProductAttribute, deleteProductAttribute} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productAttributeState, setProductAttributeState] = useState();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const { t } = useTranslation();

  const doDelete = useCallback( async (id) => {
    try {
      return await deleteProductAttribute(id);
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
    setDescription('You are about to delete a product attribute.')
    showGenericDialog(true)
  }, [id])

  const doStatusChange = async (id, status) => {
    try {
      return await updateProductAttribute(id, {
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
    setDescription('You are about to '+text+' a product attribute.')
    showGenericDialog(true)
  };

  const getProductAttribute = useCallback(async () => {
    if (id) {
      try {
        const result = await fetchProductAttribute(id)

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
          {t("Edit")}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(enabled)}>
          {enabled ? t('Disable') : t('Enable')}
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {t("Delete")}
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
