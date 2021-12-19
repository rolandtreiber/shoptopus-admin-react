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
import {APIContext} from "../../contexts/api-context";
import MultilangTextInput from "../multilang-text-input";
import {useMounted} from "../../hooks/use-mounted";
import {SettingsContext} from "../../contexts/settings-context";
import {Uploader} from "../uploader";

export const ProductCategoryCreateDialog = (props) => {
  const {open, onClose, onSuccess, ...other} = props;
  const {fetchProductCategoriesSelectData} = useContext(APIContext)
  const [categoriesSelectData, setCategoriesSelectData] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [showErrors, setShowErrors] = useState(false)
  const mounted = useMounted();
  const {language} = useContext(SettingsContext)
  const [menuImage, setMenuImage] = useState(null)
  const [headerImage, setHeaderImage] = useState(null)
  const [multipleImages, setMultipleImages] = useState([])

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
      enabled: true
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: async (values, helpers) => {
      try {
        // saveDiscountRule({
        //   name: JSON.stringify(name),
        //   amount: formik.values.amount,
        //   valid_from: format(formik.values.validFrom, 'yyyy/MM/dd HH:mm'),
        //   valid_until: format(formik.values.validUntil, 'yyyy/MM/dd HH:mm'),
        //   enabled: formik.values.enabled,
        //   type: formik.values.type
        // }).then(response => {
        //   toast.success('Voucher Code Created');
        //   helpers.setStatus({success: true});
        //   helpers.setSubmitting(false);
        //   helpers.resetForm();
        //   onSuccess();
        //   onClose?.();
        // })
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
            rows={4}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          mt={1}
        >
          <Grid
            item
            xs={12}
          >
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
                  <option key={option.name[language]} value={option.id}>
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
          <Grid
            item
            xs={12}
          >
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
