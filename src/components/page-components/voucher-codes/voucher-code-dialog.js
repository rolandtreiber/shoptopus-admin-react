import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControl,
  FormControlLabel,
  FormHelperText, FormLabel, Grid,
  Radio,
  RadioGroup, Switch, TextField,
} from '@material-ui/core';
import {InputField} from '../../common/input-field';
import {DateTimePicker} from "@material-ui/lab";
import {useContext, useEffect} from "react";
import {APIContext} from "../../../contexts/api-context";
import {format} from "date-fns";

export const VoucherCodeDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, ...other} = props;
  const plusOneMonth = new Date().setMonth(new Date().getMonth()+1);
  const { saveVoucherCode, updateVoucherCode } = useContext(APIContext)

  useEffect(() => {
    if (initialValues?.id) {
      formik.values.type = initialValues.type.toString()
      formik.values.amount = initialValues.amount
      formik.values.validFrom = new Date(initialValues.valid_from)
      formik.values.validUntil = new Date(initialValues.valid_until)
      formik.values.enabled = initialValues.enabled
    }
  }, [initialValues])

  const formik = useFormik({
    initialValues: {
      amount: 0,
      submit: 'null',
      validFrom: new Date(),
      validUntil: plusOneMonth,
      type: "0",
      enabled: true
    },
    validationSchema: Yup.object().shape({
      type: Yup.number(),
      amount: Yup.number().moreThan(0).required('Amount is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (initialValues?.id) {
          updateVoucherCode(initialValues.id, {
            amount: formik.values.amount,
            valid_from: format(formik.values.validFrom, 'yyyy/MM/dd HH:mm'),
            valid_until: format(formik.values.validUntil, 'yyyy/MM/dd HH:mm'),
            enabled: formik.values.enabled,
            type: formik.values.type
          }).then(response => {
            toast.success('Voucher Code Updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            onSuccess();
            onClose?.();
          })
        } else {
          saveVoucherCode({
            amount: formik.values.amount,
            valid_from: format(formik.values.validFrom, 'yyyy/MM/dd HH:mm'),
            valid_until: format(formik.values.validUntil, 'yyyy/MM/dd HH:mm'),
            enabled: formik.values.enabled,
            type: formik.values.type
          }).then(response => {
            toast.success('Voucher Code Created');
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
      <DialogTitle>
        {initialValues ? 'Update' : 'Create'} Voucher Code
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
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
              value={formik.values.validUntil}
              onChange={val => {
                formik.setFieldValue("validUntil", val);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup value={formik.values.type}
                          onChange={event => {
                            formik.setFieldValue("type", event.currentTarget.value.toString());
                          }}
              >
                <FormControlLabel value={"2"} control={<Radio/>} label="Fix amount"/>
                <FormControlLabel value={"1"} control={<Radio/>} label="Percentage"/>
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <InputField
              error={Boolean(formik.touched.amount && formik.errors.amount)}
              fullWidth
              helperText={formik.touched.amount && formik.errors.amount}
              label="Amount"
              name="amount"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.amount}
              type={"number"}
            />
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
              label={formik.values.type ? "Enabled" : "Disabled"}
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
            formik.handleSubmit();
          }}
          variant="contained"
        >
          {initialValues ? 'Update' : 'Create'} Voucher Code
        </Button>
      </DialogActions>
    </Dialog>
  );
};

VoucherCodeDialog.defaultProps = {
  open: false
};

VoucherCodeDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
