import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel,
  FormHelperText,
  Grid, Switch, TextField
} from '@material-ui/core';
import { InputField } from '../input-field';
import {DateTimePicker} from "@material-ui/lab";

export const VoucherCodeCreateDialog = (props) => {
  const { open, onClose, ...other } = props;
  const formik = useFormik({
    initialValues: {
      description: '',
      name: '',
      submit: 'null',
      validFrom: new Date(),
      validUntil: new Date(),
      type: false
    },
    validationSchema: Yup.object().shape({
      validFrom: Yup.date(),
      validUntil: Yup.date(),
      description: Yup.string().max(500).required('Description is required'),
      name: Yup.string().max(255).required('Name is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        toast.success('Product created');
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        helpers.resetForm();
        onClose?.();
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
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
        Create Voucher Code
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          mt={1}
        >
          <Grid
            item
            xs={6}
          >
          <DateTimePicker
            label="Valid From"
            value={formik.values.validFrom}
            onChange={val => {
              formik.setFieldValue("validFrom", val);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          </Grid>
          <Grid
            item
            xs={6}
          >
          <DateTimePicker
            label="Valid Until"
            value={formik.values.validFrom}
            onChange={val => {
              formik.setFieldValue("validUntil", val);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.type}
                  onChange={event => {
                    formik.setFieldValue("type", event.currentTarget.checked);
                  }}
                  color="primary"
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={formik.values.type ? "Price" : "Percentage"}
            />

          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Product name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              multiline
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              rows={4}
              value={formik.values.description}
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
          onClick={() => { formik.handleSubmit(); }}
          variant="contained"
        >
          Create Voucher Code
        </Button>
      </DialogActions>
    </Dialog>
  );
};

VoucherCodeCreateDialog.defaultProps = {
  open: false
};

VoucherCodeCreateDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
