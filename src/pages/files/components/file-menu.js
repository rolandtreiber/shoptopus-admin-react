import {IconButton, Menu, MenuItem} from '@material-ui/core';
import {usePopover} from '../../../hooks/use-popover';
import {DotsVertical as DotsVerticalIcon} from '../../../icons/dots-vertical';
import {useCallback, useContext, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import {DialogContext} from "../../../contexts/dialog-context";
import {FileDialog} from "../../products/components/file-dialog";
import {useTranslation} from "react-i18next";

export const FileMenu = (props) => {
  const mounted = useMounted();
  const {id, onSuccess} = props;
  const {fetchFile, deleteFile} = useContext(APIContext)
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [fileState, setFileState] = useState();
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const { t } = useTranslation();

  const getFile = useCallback(async () => {
    if (id) {
      try {
        const result = await fetchFile(id)

        if (mounted.current) {
          setFileState(result.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [id])

  const handleEdit = () => {
    handleClose();
    getFile().then(() => {
      setOpenEditDialog(true)
    }).catch(e => console.log(e))
  };

  const doDelete = useCallback( async (id) => {
    try {
      return await deleteFile(id);
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
    setDescription('You are about to delete a file.')
    showGenericDialog(true)
  }, [id])

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
        <MenuItem onClick={handleDelete}>
          {t("Delete")}
        </MenuItem>
      </Menu>
      {fileState && <FileDialog
        onClose={() => setOpenEditDialog(false)}
        open={openEditDialog}
        onSuccess={onSuccess}
        initialValues={fileState}
      />}
    </>
  );
};
