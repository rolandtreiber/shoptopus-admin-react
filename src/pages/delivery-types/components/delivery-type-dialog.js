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
  Grid, Switch,
} from '@material-ui/core';
import {useContext, useEffect, useState} from "react";
import TrButton from "../../../components/common/translated/translated-button";
import {APIContext} from "../../../contexts/api-context";
import MultilangTextInput from "../../../components/common/input-fields/multilang-text-input";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import {InputField} from "../../../components/common/input-fields/input-field";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

export const DeliveryTypeDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, ...other} = props;
  const {saveDeliveryType, updateDeliveryType} = useContext(APIContext)
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()

  useEffect(() => {
    if (initialValues) {
      formik.values.name = initialValues.name
      formik.values.description = initialValues.description
      formik.values.price = initialValues.price
      formik.values.enabled = initialValues.enabled
    }
  }, [initialValues])

  const formik = useFormik({
    initialValues: {
      name: '',
      description: 'null',
      enabled: true,
      price: 0
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        formData.append("name", JSON.stringify(name))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("price", formik.values.price)

        if (initialValues?.id) {
          isValid && updateDeliveryType(initialValues.id, formData).then(response => {
            toast.success('Delivery Type Updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setShowErrors(false)
            onSuccess();
            onClose?.();
          })
        } else {
          isValid && saveDeliveryType(formData).then(response => {
            toast.success('Delivery Type Created');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setShowErrors(false)
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
        {initialValues ? 'Update Delivery Type' : 'Create Delivery Type'}
      </TrDialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
            width={12}
            title={"Name"}
            field={"name"}
            onChange={setName}
            showErrors={showErrors}
            value={formik.values.name}
            setValid={(valid) => {setValidation({name : valid})}}
          />
        </Grid>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
            width={12}
            title={"Description"}
            field={"description"}
            onChange={setDescription}
            showErrors={showErrors}
            value={formik.values.description}
            setValid={(valid) => {setValidation({description : valid})}}
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>        <Grid item xs={6}>
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
            label={formik.values.enabled === true ? "Enabled" : "Disabled"}
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
          {initialValues ? 'Update Delivery Type' : 'Create Delivery Type'}
        </TrButton>
      </DialogActions>
    </Dialog>
  );
};

DeliveryTypeDialog.defaultProps = {
  open: false
};

DeliveryTypeDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
