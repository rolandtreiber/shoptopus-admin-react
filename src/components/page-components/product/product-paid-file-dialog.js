import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid, List, ListItem, ListItemText
} from '@material-ui/core';
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import MultilangTextInput from "../../common/multilang-text-input";
import {getFileFromBlob} from "../../../utils/file-operations";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import {PaidFileUploader} from "../../common/file-upload/paid-file-uploader";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {LoadingButton} from "@material-ui/lab";

export const ProductPaidFileDialog = ({initialValues, productId, open, onClose, onSuccess, ...other}) => {
  const [file, setFile] = useState()
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const {savePaidFileForProduct, updatePaidFileForProduct} = useContext(APIContext)
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid, validations} = useNestedValidation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title)
      setDescription(initialValues.description)
      formik.values.title = initialValues.title
      formik.values.description = initialValues.description
    } else {
      setTitle(null)
      setDescription(null)

      formik.values.title = ""
      formik.values.description = ""
    }
  }, [initialValues])

  useEffect(() => {
    if (!initialValues ) {
      if (!file) {
        setValidation({file: false})
      } else {
        setValidation({file: true})
      }
    } else {
      setValidation({file: true})
    }
  }, [file, initialValues])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, helpers) => {
      setLoading(true)
      try {
        let formData = new FormData();
        if (isValid && file) {
          const fileBlob = await fetch(file.objectUrl).then(r => r.blob());
          formData.append("file", getFileFromBlob(fileBlob))
        }
        formData.append("title", JSON.stringify(title))
        formData.append("description", JSON.stringify(description))
        formData.append("original_file_name", file.fileName)

        if (initialValues) {
          isValid && updatePaidFileForProduct(productId, initialValues.id, formData).then(response => {
            toast.success('File Updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setFile(null)
            setShowErrors(false)
            onSuccess();
            onClose?.();
          }).finally(() => setLoading(false))
        } else {
          isValid && savePaidFileForProduct(productId, formData).then(response => {
            toast.success('File Saved');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setFile(null)
            setShowErrors(false)
            onSuccess();
            onClose?.();
          }).finally(() => setLoading(false))
        }
      } catch (err) {
        console.error(err);
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Dialog
      onClose={onClose}
      open={open}
      TransitionProps={{
        onExited: () => formik.resetForm()
      }}
      {...other}
    >
      <DialogTitle>
        {initialValues ? 'Update' : 'Create'} Paid File Content
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <MultilangTextInput
              width={12}
              title={"Title"}
              field={"title"}
              value={title}
              onChange={setTitle}
              showErrors={showErrors}
              setValid={(valid) => {
                setValidation({title: valid})
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MultilangTextInput
              width={12}
              title={"Description"}
              field={"description"}
              value={description}
              onChange={setDescription}
              showErrors={showErrors}
              setValid={(valid) => {
                setValidation({description: valid})
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <PaidFileUploader data={file} setData={setFile}/>
            {!validations.file && !initialValues && showErrors && (
              <Grid
                item
                xs={12}
              >
                <FormHelperText error>
                  No file selected
                </FormHelperText>
              </Grid>
            )}
            {file && (<>
              <List>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => setFile(null)} edge="end" aria-label="delete">
                      <DeleteIcon/>
                    </IconButton>
                  }
                >
                  <ListItemText sx={{width: "80%"}}>{file.fileName}</ListItemText>
                </ListItem>
              </List>
            </>)
            }
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          {formik.errors.submit && (
            <Grid
              item
              xs={12}
            >
              <FormHelperText error>
                {formik.errors.submit}
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <LoadingButton
          color="primary"
          loading={loading}
          onClick={() => {
            setShowErrors(true)
            formik.handleSubmit();
          }}
          variant="contained"
        >
          {initialValues ? 'Update' : 'Create'} Paid File Content
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

ProductPaidFileDialog.defaultProps = {
  open: false
};

ProductPaidFileDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
