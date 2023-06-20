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
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import MultilangTextInput from "../../common/multilang-text-input";
import {useMounted} from "../../../hooks/use-mounted";
import {SettingsContext} from "../../../contexts/settings-context";
import {Uploader} from "../../common/uploader";
import {getFileFromBlob} from "../../../utils/file-operations";
import {useNestedValidation} from "../../../hooks/use-nested-validation";

export const ProductCategoryCreateDialog = (props) => {
  const {open, onClose, onSuccess, ...other} = props;
  const {fetchProductCategoriesSelectData, saveProductCategory} = useContext(APIContext)
  const [categoriesSelectData, setCategoriesSelectData] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const mounted = useMounted();
  const {language} = useContext(SettingsContext)
  const [menuImage, setMenuImage] = useState(null)
  const [headerImage, setHeaderImage] = useState(null)
  const {setValidation, isValid} = useNestedValidation()

  useEffect(() => {
    fetchCategoriesSelectData().catch(console.error)
  }, [])

  const fetchCategoriesSelectData = useCallback(async () => {
    setCategoriesSelectData(() => ({isLoading: true}));

    try {
      const result = await fetchProductCategoriesSelectData()

      if (mounted.current) {
        setCategoriesSelectData(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setCategoriesSelectData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      parentId: '',
      submit: 'null',
      enabled: true,
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: async (values, helpers) => {
      try {
        let formData = new FormData();
        if (menuImage) {
          const menuImageBlob = await fetch(menuImage).then(r => r.blob());
          formData.append("menu_image", getFileFromBlob(menuImageBlob))
        }
        if (headerImage) {
          const headerImageBlob = await fetch(headerImage).then(r => r.blob());
          formData.append("header_image", getFileFromBlob(headerImageBlob))
        }

        formData.append("name", JSON.stringify(name))
        formData.append("description", JSON.stringify(description))
        formData.append("enabled", formik.values.enabled)
        formData.append("parent_id", formik.values.parentId)

        isValid && saveProductCategory(formData).then(response => {
          toast.success('ProductSingle Category Created');
          helpers.setStatus({success: true});
          helpers.setSubmitting(false);
          helpers.resetForm();
          setMenuImage(null)
          setHeaderImage(null)
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
        Create Product Category
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
        <Grid container spacing={2} mt={1}>
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
            <Uploader title={"Menu Image"} multiple={false} data={menuImage} setData={setMenuImage}/>
          </Grid>
          <Grid item xs={12}>
            <Uploader title={"Header Image"} multiple={false} data={headerImage} setData={setHeaderImage}/>
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
          Create Product Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductCategoryCreateDialog.defaultProps = {
  open: false
};

ProductCategoryCreateDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
