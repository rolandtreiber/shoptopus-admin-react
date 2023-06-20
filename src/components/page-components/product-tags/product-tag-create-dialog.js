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
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import MultilangTextInput from "../../common/multilang-text-input";
import {Uploader} from "../../common/uploader";
import {getFileFromBlob} from "../../../utils/file-operations";
import {useNestedValidation} from "../../../hooks/use-nested-validation";

export const ProductTagCreateDialog = (props) => {
  const {open, onClose, onSuccess, ...other} = props;
  const {saveProductTag} = useContext(APIContext)
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const [badge, setBadge] = useState(null)
  const {setValidation, isValid} = useNestedValidation()

  const formik = useFormik({
    initialValues: {
      parentId: '',
      submit: 'null',
      enabled: true,
      display_badge: false
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (badge) {
          const badgeBlob = await fetch(badge).then(r => r.blob());
          formData.append("badge", getFileFromBlob(badgeBlob))
        }
        formData.append("name", JSON.stringify(name))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("display_badge", formik.values.display_badge)

        isValid && saveProductTag(formData).then(response => {
          toast.success('ProductSingle Tag Created');
          helpers.setStatus({success: true});
          helpers.setSubmitting(false);
          helpers.resetForm();
          setBadge(null)
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
        Create Product Tag
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <MultilangTextInput
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
            <Uploader title={"Badge"} multiple={false} data={badge} setData={setBadge}/>
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
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.display_badge}
                  onChange={event => {
                    formik.setFieldValue("display_badge", event.currentTarget.checked);
                  }}
                  color="primary"
                  inputProps={{'aria-label': 'controlled'}}
                />
              }
              label={"Display Badge"}
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
          Create Product Tag
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductTagCreateDialog.defaultProps = {
  open: false
};

ProductTagCreateDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
