import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Grid, InputLabel, Switch
} from '@material-ui/core';
import {InputField} from '../../../components/common/input-fields/input-field';
import {useContext, useEffect, useState} from "react";
import TrButton from "../../../components/common/translated/translated-button";
import {APIContext} from "../../../contexts/api-context";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import {getFileFromBlob} from "../../../utils/file-operations";
import MultilangTextInput from "../../../components/common/input-fields/multilang-text-input";
import {Uploader} from "../../../components/common/file-upload/uploader";
import {SettingsContext} from "../../../contexts/settings-context";
import AttributeTreeSelect from "../../../components/common/attribute-tree-select";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

export const ProductVariantDialog = (props) => {
  const {open, onClose, onSuccess, variant, productId, ...other} = props;
  const {saveProductVariant, updateProductVariant} = useContext(APIContext)
  const [description, setDescription] = useState()
  const [attachments, setAttachments] = useState([])
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()
  const {sharedOptions} = useContext(SettingsContext)
  const {language} = useContext(SettingsContext)
  const [attributes, setAttributes] = useState([])

  const getFileBlobs = async (files) => {
    return await Promise.all(files.map(async (file) => {
      return await fetch(file).then(r => r.blob())
    }));
  }

  useEffect(() => {
    if (variant) {
      setDescription(variant.description)
      setAttachments(variant.images.map(img => img.url))
      setAttributes(() => {
        let selection = [];
        variant.attributes.forEach(attr => {
          if (attr.option) {
            selection = [...selection, attr.id, attr.option.id]
          }
        })
        return [...selection]
      })
      formik.values.sku = variant.sku
      formik.values.stock = variant.stock
      formik.values.price = variant.price
      formik.values.enabled = variant.enabled
    } else {
      setDescription(null)
      setAttachments([])
      setAttributes([])
      formik.values.sku = ''
      formik.values.stock = ''
      formik.values.price = ''
      formik.values.enabled = true
    }
  }, [variant])

  const formik = useFormik({
    initialValues: {
      price: '',
      stock: '',
      sku: '',
      enabled: true,
      submit: 'null'
    },
    validationSchema: Yup.object().shape({
      price: Yup.number().min(0).required('Please enter a valid price'),
      stock: Yup.number().min(0).required('Please enter valid stock'),
      sku: Yup.string().required('Please enter a SKU'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (attachments) {
          const attachmentBlobs = await getFileBlobs(attachments)
          attachmentBlobs.forEach(attachmentBlob => {
            formData.append("attachments[]", getFileFromBlob(attachmentBlob))
          })
        }
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("price", formik.values.price)
        formData.append("stock", formik.values.stock)
        formData.append("sku", formik.values.sku)

        attributes.map(attribute => {
          formData.append("product_attributes[" + attribute.attributeId + "]", attribute.optionId)
        })

        if (variant) {
          isValid && updateProductVariant(productId, variant.id, formData).then(response => {
            toast.success('ProductSingle variant updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            onSuccess();
            onClose?.();
          })
        } else {
          isValid && saveProductVariant(productId, formData).then(response => {
            toast.success('ProductSingle variant created');
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

  return (
    <Dialog
      onClose={onClose}
      open={open}
      TransitionProps={{
        onExited: () => formik.resetForm()
      }}
      {...other}
    >
      <TrDialogTitle>
        {variant ? 'Update Product Variant' : 'Create Product Variant'}
      </TrDialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Uploader title={"Files"} multiple={true} data={attachments} setData={setAttachments}/>
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Attributes</InputLabel>
          <AttributeTreeSelect selection={attributes} setSelection={setAttributes}
                               attributes={sharedOptions.attributes}/>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
            value={description}
            width={12}
            title={"Description"}
            field={"description"}
            onChange={setDescription}
            showErrors={showErrors}
            setValid={(valid) => {
              setValidation({description: valid})
            }}
            rows={4}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <InputField
            error={Boolean(formik.touched.sku && formik.errors.sku)}
            fullWidth
            helperText={formik.touched.sku && formik.errors.sku}
            label="SKU"
            name="sku"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.sku}
            type={"text"}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <InputField
            error={Boolean(formik.touched.price && formik.errors.price)}
            fullWidth
            helperText={formik.touched.price && formik.errors.price}
            label="Price"
            name="price"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.price}
            type={"number"}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <InputField
            error={Boolean(formik.touched.stock && formik.errors.stock)}
            fullWidth
            helperText={formik.touched.stock && formik.errors.stock}
            label="Stock"
            name="stock"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.stock}
            type={"number"}
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
      </DialogContent>
      <DialogActions>
        <TrButton
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </TrButton>
        <TrButton
          color="primary"
          disabled={formik.isSubmitting}
          onClick={() => {
            setShowErrors(true)
            formik.handleSubmit();
          }}
          variant="contained"
        >
          {variant ? 'Update Product Variant' : 'Create Product Variant'}
        </TrButton>
      </DialogActions>
    </Dialog>
  );
};

ProductVariantDialog.defaultProps = {
  open: false
};

ProductVariantDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
