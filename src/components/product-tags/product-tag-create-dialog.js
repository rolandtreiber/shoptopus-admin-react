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
import {APIContext} from "../../contexts/api-context";
import MultilangTextInput from "../multilang-text-input";
import {SettingsContext} from "../../contexts/settings-context";
import {Uploader} from "../uploader";
import {getFileFromBlob} from "../../utils/file-operations";
import {useNestedValidation} from "../../hooks/use-nested-validation";

export const ProductTagCreateDialog = (props) => {
  const {open, onClose, onSuccess, ...other} = props;
  const {saveProductTag} = useContext(APIContext)
  const [categoriesSelectData] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const {language} = useContext(SettingsContext)
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
        const badgeBlob = await fetch(badge).then(r => r.blob());
        let formData = new FormData();
        formData.append("name", JSON.stringify(name))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("badge", getFileFromBlob(badgeBlob))

        isValid && saveProductTag(formData).then(response => {
          toast.success('Product Tag Created');
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

  useEffect(() => {
    console.log(isValid)
  }, [isValid])

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
        <Grid
          container
          spacing={2}
          mt={1}
        >
          <MultilangTextInput
            width={12}
            title={"Name"}
            field={"name"}
            onChange={setName}
            showErrors={showErrors}
            setValid={(valid) => {setValidation({name : valid})}}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          mt={1}
        >
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
        <Grid
          container
          spacing={2}
          mt={1}
        >
          <Grid item xs={12}>
            {categoriesSelectData && categoriesSelectData.isLoading === false && categoriesSelectData.data && (
              <TextField
                id="outlined-select-currency-native"
                select
                label="Parent"
                value={formik.values.parentId}
                fullWidth={true}
                onChange={event => {
                  formik.setFieldValue("parentId", event.currentTarget.value);
                }}
                SelectProps={{
                  native: true,
                }}
              >
                <option key={'no-parent'} value={null}>

                </option>
                {categoriesSelectData.data.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name[language]}
                  </option>
                ))}
              </TextField>
            )}
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
