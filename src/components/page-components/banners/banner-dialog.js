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
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import MultilangTextInput from "../../common/multilang-text-input";
import {Uploader} from "../../common/uploader";
import {getFileFromBlob} from "../../../utils/file-operations";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import {InputField} from "../../common/input-field";

export const BannerDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, ...other} = props;
  const {saveBanner, updateBanner} = useContext(APIContext)
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [buttonText, setButtonText] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const {setValidation, isValid} = useNestedValidation()

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title)
      setDescription(initialValues.description)
      setButtonText(initialValues.button_text)
      setBackgroundImage(initialValues.background_image?.url ? initialValues.background_image.url : "")
      formik.values.title = initialValues.title
      formik.values.description = initialValues.description
      formik.values.enabled = initialValues.enabled
      formik.values.button_url = initialValues.button_url
      formik.values.show_button = initialValues.show_button
    }
  }, [initialValues])

  const formik = useFormik({
    initialValues: {
      submit: 'null',
      enabled: true,
      type: 0,
      button_url: '',
      show_button: true
    },
    validationSchema: Yup.object().shape({
      button_url: Yup.string().nullable(true)
        .when("show_button", {
          is: true,
          then: Yup.string().required('The button url is required')
        })
    }),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (backgroundImage) {
          const backgroundImageBlob = await fetch(backgroundImage).then(r => r.blob());
          formData.append("background_image", getFileFromBlob(backgroundImageBlob))
        }
        formData.append("title", JSON.stringify(title))
        formData.append("description", JSON.stringify(description))
        formData.append("button_text", JSON.stringify(buttonText))
        formData.append("button_url", formik.values.button_url)
        formData.append("enabled", formik.values.enabled)
        formData.append("show_button", formik.values.show_button)

        if (initialValues?.id) {
          isValid && updateBanner(initialValues.id, formData).then(response => {
            toast.success('Banner Updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setBackgroundImage(null)
            setShowErrors(false)
            onSuccess();
            onClose?.();
          })
        } else {
          isValid && saveBanner(formData).then(response => {
            toast.success('Banner Created');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            setBackgroundImage(null)
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
      <DialogTitle>
        {initialValues ? 'Update' : 'Create'} Banner
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <MultilangTextInput
              width={12}
              title={"Title"}
              field={"title"}
              onChange={setTitle}
              value={title}
              showErrors={showErrors}
              setValid={(valid) => {
                setValidation({title: valid})
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MultilangTextInput
              width={12}
              title={"Description"}
              field={"description"}
              onChange={setDescription}
              value={description}
              showErrors={showErrors}
              setValid={(valid) => {
                setValidation({description: valid})
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.show_button}
                  onChange={event => {
                    if (!event.currentTarget.checked) {
                      formik.setFieldValue("button_url", "");
                    }
                    formik.setFieldValue("show_button", event.currentTarget.checked);
                  }}
                  color="primary"
                  inputProps={{'aria-label': 'controlled'}}
                />
              }
              label={formik.values.show_button ? "With Button" : "Without Button"}
            />
          </Grid>
          {formik.values.show_button && <><Grid item xs={12}>
            <MultilangTextInput
              width={12}
              title={"Button Text"}
              field={"button_text"}
              onChange={setButtonText}
              value={buttonText}
              showErrors={showErrors}
              nullable={true}
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              error={Boolean(formik.touched.button_url && formik.errors.button_url)}
              fullWidth
              helperText={formik.touched.button_url && formik.errors.button_url}
              label="Button Url"
              name="button_url"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.button_url}
            />
          </Grid></>}
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Uploader title={"Background Image"} multiple={false} data={backgroundImage} setData={setBackgroundImage}/>
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
          {initialValues ? 'Update' : 'Create'} Banner
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BannerDialog.defaultProps = {
  open: false
};

BannerDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
