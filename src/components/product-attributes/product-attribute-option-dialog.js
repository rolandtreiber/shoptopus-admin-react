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
  Grid, Switch
} from '@material-ui/core';
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useNestedValidation} from "../../hooks/use-nested-validation";
import {getFileFromBlob} from "../../utils/file-operations";
import MultilangTextInput from "../multilang-text-input";
import {Uploader} from "../uploader";
import {InputField} from "../input-field";

export const ProductAttributeOptionDialog = (props) => {
  const {productAttributeId, productAttributeOptionId, open, onClose, onSuccess, initialValues, ...other} = props;
  const {saveProductAttributeOption, updateProductAttributeOption} = useContext(APIContext)
  const [name, setName] = useState()
  const [commonValue, setCommonValue] = useState()
  const [image, setImage] = useState(null)
  const [enabled, setEnabled] = useState(null)
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()

  const formik = useFormik({
    initialValues: {
      name: null,
      commonValue: null,
      enabled: true,
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (image) {
          const imageBlob = await fetch(image).then(r => r.blob());
          formData.append("image", getFileFromBlob(imageBlob))
        }
        formData.append("name", JSON.stringify(name))
        formData.append("value", formik.values.commonValue)
        formData.append("enabled", formik.values.enabled)

        if (initialValues) {
          isValid && updateProductAttributeOption(productAttributeId, productAttributeOptionId, formData).then(response => {
            toast.success('Attribute option updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            onSuccess();
            onClose?.();
          })
        } else {
          isValid && saveProductAttributeOption(productAttributeId, formData).then(response => {
            toast.success('Attribute option created');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            onSuccess();
            onClose?.();
          })
        }
      } catch (err) {
        console.error(err);
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (initialValues) {
      console.log(initialValues)
      setName(initialValues.name)
      setCommonValue(initialValues.common_value)
      setImage(initialValues.image ? initialValues.image : null)
      setEnabled(initialValues.enabled ? initialValues.enabled : true)

      formik.values.name = initialValues.name
      formik.values.commonValue = initialValues.value
      formik.values.enabled = initialValues.enabled
    }
  }, [initialValues])

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
        {initialValues ? 'Update' : 'Create'} Attribute Option
      </DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Uploader title={"Image"} multiple={false} data={image} setData={setImage}/>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
            value={name}
            width={12}
            title={"Name"}
            field={"name"}
            onChange={setName}
            showErrors={showErrors}
            setValid={(valid) => {
              setValidation({name: valid})
            }}
          />
        </Grid>
        <Grid container spacing={2} mt={1}>
          <InputField
              error={Boolean(formik.touched.commonValue && formik.errors.commonValue)}
              fullWidth
              helperText={formik.touched.sku && formik.errors.sku}
              label="Value"
              name="value"
              onBlur={formik.handleBlur}
              onChange={event => {
                formik.setFieldValue("commonValue", event.currentTarget.value)
              }}
              value={formik.values.commonValue}
              type={"text"}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
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
            label={"Enabled"}
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
          {initialValues ? 'Update' : 'Create'} Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductAttributeOptionDialog.defaultProps = {
  open: false
};

ProductAttributeOptionDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
