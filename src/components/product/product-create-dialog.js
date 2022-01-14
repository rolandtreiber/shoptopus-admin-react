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
import {InputField} from '../input-field';
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useNestedValidation} from "../../hooks/use-nested-validation";
import {getFileFromBlob} from "../../utils/file-operations";
import MultilangTextInput from "../multilang-text-input";
import {Uploader} from "../uploader";
import {SettingsContext} from "../../contexts/settings-context";
import CategoryTreeSelect from "../category-tree-select";
import AttributeTreeSelect from "../attribute-tree-select";

export const ProductCreateDialog = (props) => {
  const {open, onClose, ...other} = props;
  const {saveProduct} = useContext(APIContext)
  const [name, setName] = useState()
  const [shortDescription, setShortDescription] = useState()
  const [description, setDescription] = useState()
  const [attachments, setAttachments] = useState([])
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()
  const {sharedOptions} = useContext(SettingsContext)
  const {language} = useContext(SettingsContext)

  const getFileBlobs = async (files) => {
    return await Promise.all(files.map(async (file) => {
      return await fetch(file).then(r => r.blob())
    }));
  }

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
        formData.append("name", JSON.stringify(name))
        formData.append("short_description", JSON.stringify(shortDescription))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("price", formik.values.price)
        formData.append("stock", formik.values.stock)

        isValid && saveProduct(formData).then(response => {
          toast.success('Product created');
          helpers.setStatus({success: true});
          helpers.setSubmitting(false);
          helpers.resetForm();
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
        Create Product
      </DialogTitle>
      <DialogContent>
        <AttributeTreeSelect attributes={sharedOptions.attributes}/>
        <CategoryTreeSelect categories={sharedOptions.categories}/>
        <Grid item xs={12}>
          <Uploader title={"Files"} multiple={true} data={attachments} setData={setAttachments}/>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
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
          <MultilangTextInput
            width={12}
            title={"Short description"}
            field={"short_description"}
            onChange={setShortDescription}
            showErrors={showErrors}
            setValid={(valid) => {
              setValidation({short_description: valid})
            }}
            rows={4}
          />
        </Grid>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
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
          Create Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductCreateDialog.defaultProps = {
  open: false
};

ProductCreateDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
