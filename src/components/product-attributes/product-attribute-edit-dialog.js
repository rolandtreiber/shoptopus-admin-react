import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  FormHelperText,
  Grid, Switch, TextField,
} from '@material-ui/core';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import MultilangTextInput from "../multilang-text-input";
import {Uploader} from "../uploader";
import {getFileFromBlob} from "../../utils/file-operations";
import {useNestedValidation} from "../../hooks/use-nested-validation";

export const ProductAttributeEditDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, ...other} = props;
  const {updateProductAttribute} = useContext(APIContext)
  const [name, setName] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const [image, setImage] = useState(null)
  const {setValidation, isValid} = useNestedValidation()

  const types = [
    'Text', 'Image', 'Color'
  ];

  useEffect(() => {
    setImages().catch(e => {
      console.log(e.message)
    })
  }, [initialValues])

  const setImages = async () => {
    setImage(initialValues.image ? initialValues.image : null)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
    }),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (image) {
          const imageBlob = await fetch(image).then(r => r.blob());
          formData.append("image", getFileFromBlob(imageBlob))
        }

        formData.append("name", JSON.stringify(name))
        formData.append("type", formik.values.type)
        formData.append("enabled", formik.values.enabled)

        isValid && updateProductAttribute(initialValues.id, formData).then(response => {
          toast.success('Product Attribute Updated');
          helpers.setStatus({success: true});
          helpers.setSubmitting(false);
          helpers.resetForm();
          setImage(null)
          setShowErrors(false)
          onSuccess();
          onClose?.();
        })
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
        Update Product Attribute
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
            value={initialValues.name}
            width={12}
            title={"Name"}
            field={"name"}
            onChange={setName}
            showErrors={showErrors}
            setValid={(valid) => {setValidation({name : valid})}}
          />
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Uploader title={"Image"} multiple={false} data={image} setData={setImage}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-select-currency-native"
              select
              label="Type"
              value={formik.values.type}
              fullWidth={true}
              onChange={event => {
                formik.setFieldValue("type", event.currentTarget.value);
              }}
              SelectProps={{
                native: true,
              }}
            >
              {types.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.enabled}
                  onChange={event => {
                    formik.setFieldValue("enabled", event.currentTarget.checked);
                  }}
                  color="primary"
                  inputProps={{'aria-label': 'controlled'}}
                />
              }
              label={formik.values.enabled ? "Enabled" : "Disabled"}
            />

          </Grid>
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
        <Button
          color="primary"
          disabled={formik.isSubmitting}
          onClick={() => {
            setShowErrors(true)
            formik.handleSubmit();
          }}
          variant="contained"
        >
          Update Product Attribute
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductAttributeEditDialog.defaultProps = {
  open: false
};

ProductAttributeEditDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
