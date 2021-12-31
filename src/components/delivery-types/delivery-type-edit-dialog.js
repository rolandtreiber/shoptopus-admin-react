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
  Grid, Switch,
} from '@material-ui/core';
import {useContext, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import MultilangTextInput from "../multilang-text-input";
import {useNestedValidation} from "../../hooks/use-nested-validation";
import {InputField} from "../input-field";

export const DeliveryTypeEditDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, ...other} = props;
  const {updateDeliveryType} = useContext(APIContext)
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        formData.append("name", JSON.stringify(name))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("price", formik.values.price)

        isValid && updateDeliveryType(initialValues.id, formData).then(response => {
          toast.success('Delivery Type Updated');
          helpers.setStatus({success: true});
          helpers.setSubmitting(false);
          helpers.resetForm();
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
        Update Delivery Type
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
          <MultilangTextInput
            value={initialValues.description}
            width={12}
            title={"Description"}
            field={"description"}
            onChange={setDescription}
            showErrors={showErrors}
            setValid={(valid) => {setValidation({description : valid})}}
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            error={Boolean(formik.touched.amount && formik.errors.amount)}
            fullWidth
            helperText={formik.touched.amount && formik.errors.amount}
            label="Price"
            name="price"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.price}
            type={"number"}
          />
        </Grid>
        <Grid item xs={6}>
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
          Update Delivery Type
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeliveryTypeEditDialog.defaultProps = {
  open: false
};

DeliveryTypeEditDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
