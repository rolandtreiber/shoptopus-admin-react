import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Box,
  Button, Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput,
  Switch,
} from '@material-ui/core';
import {InputField} from '../../../components/common/input-fields/input-field';
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import LocationFinder from "../../../components/common/maps/locationfinder";
import IconButton from "@material-ui/core/IconButton";
import {Plus} from "../../../icons/plus";
import DeleteIcon from '@mui/icons-material/Delete';
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

export const DeliveryRuleDialog = (props) => {
  const {initialValues, open, onClose, onSuccess, deliveryTypeId, ...other} = props;
  const {saveDeliveryRule, updateDeliveryRule} = useContext(APIContext)
  const [showErrors, setShowErrors] = useState(false)
  const {setValidation, isValid} = useNestedValidation()
  const [loc, setLoc] = useState({
    lat: 51.45,
    lng: -2.58,
    radius: 2
  })
  const [postcode, setPostcode] = useState("")

  useEffect(() => {
    if (initialValues) {
      if (!initialValues.min_weight) { formik.values.show_min_weight = false }
      if (!initialValues.max_weight) { formik.values.show_max_weight = false }
      if (!initialValues.min_distance) { formik.values.show_min_distance = false }
      if (!initialValues.max_distance) { formik.values.show_max_distance = false }
      setLoc({
        lat: parseFloat(initialValues.lat),
        lng: parseFloat(initialValues.lon),
        radius: initialValues.max_distance ? initialValues.max_distance : 0
      })
      formik.values.min_weight = initialValues.min_weight
      formik.values.max_weight = initialValues.max_weight
      formik.values.min_distance = initialValues.min_distance
      formik.values.max_distance = initialValues.max_distance
      formik.values.postcodes = initialValues.postcodes ? initialValues.postcodes : []
      formik.values.enabled = initialValues.enabled
    } else {
      formik.values.min_weight = 0
      formik.values.max_weight = 0
      formik.values.min_distance = 0
      formik.values.max_distance = 0
      formik.values.postcodes = []
      formik.values.enabled = true
    }
    formik.resetForm({
      show_min_weight: false,
      show_max_weight: true,
      show_min_distance: true,
      show_max_distance: true,
      show_postcodes: true,
      min_weight: 0,
      max_weight: 0,
      min_distance: 0,
      max_distance: 0,
      postcodes: [],
      enabled: true
    })
  }, [initialValues])

  const formik = useFormik({
    initialValues: {
      show_min_weight: true,
      show_max_weight: true,
      show_min_distance: true,
      show_max_distance: true,
      show_postcodes: true,
      min_weight: 0,
      max_weight: 0,
      min_distance: 0,
      max_distance: 0,
      postcodes: [],
      enabled: true
    },
    validationSchema: Yup.object().shape({
      min_weight: Yup.number().moreThan(-1, 'The value needs to be positive')
        .when("show_min_weight", {
        is: false,
        then: Yup.number().nullable(true)
      }),
      max_weight: Yup.number().moreThan(-1, 'The value needs to be positive')
        .when("show_max_weight", {
          is: false,
          then: Yup.number().nullable(true)
        }),
      min_distance: Yup.number().moreThan(-1, 'The value needs to be positive')
        .when("show_min_distance", {
          is: false,
          then: Yup.number().nullable(true)
        }),
      max_distance: Yup.number().moreThan(-1, 'The value needs to be positive')
        .when("show_max_distance", {
          is: false,
          then: Yup.number().nullable(true)
        }),
    }),
    onSubmit: async (values, helpers) => {
      try {
        let payload = {}
        if (formik.values.show_min_weight === true) {
          payload.min_weight = formik.values.min_weight
        }
        if (formik.values.show_max_weight === true) {
          payload.max_weight = formik.values.max_weight
        }
        if (formik.values.show_min_distance === true) {
          payload.min_distance = formik.values.min_distance
        }
        if (formik.values.show_max_distance === true) {
          payload.max_distance = formik.values.max_distance
        }
        if (formik.values.show_postcodes === true) {
          payload.postcodes = formik.values.postcodes
        }
        if (formik.values.show_min_distance === true || formik.values.show_max_distance === true) {
          payload.lat = loc.lat
          payload.lon = loc.lng
        }

        payload.enabled = formik.values.enabled
        if (initialValues?.id) {
          isValid && updateDeliveryRule(deliveryTypeId, initialValues.id, payload).then(response => {
            toast.success('Delivery Rule Updated');
            helpers.setStatus({success: true});
            helpers.setSubmitting(false);
            helpers.resetForm();
            onSuccess();
            onClose?.();
          })
        } else {
          isValid && saveDeliveryRule(deliveryTypeId, payload).then(response => {
            toast.success('Delivery Rule Created');
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
      <TrDialogTitle>
        {initialValues ? 'Update Delivery Rule' : 'Create Delivery Rule'}
      </TrDialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3} sm={2}>
            <br/>
            <Switch
              checked={formik.values.show_min_weight}
              onChange={event => {
                if (event.currentTarget.checked) {
                  formik.setFieldValue("min_weight", 0);
                } else {
                  formik.setFieldValue("min_weight", "");
                }
                formik.setFieldValue("show_min_weight", event.currentTarget.checked);
              }}
              color="primary"
              inputProps={{'aria-label': 'controlled'}}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <InputField
              error={Boolean(formik.touched.min_weight && formik.errors.min_weight)}
              fullWidth
              disabled={!formik.values.show_min_weight}
              helperText={formik.touched.min_weight && formik.errors.min_weight}
              label="Minimum Weight (g)"
              name="min_weight"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.min_weight}
              type={"number"}
            />
          </Grid>

          <Grid item xs={3} sm={2}>
            <br/>
            <Switch
              checked={formik.values.show_max_weight}
              onChange={event => {
                if (event.currentTarget.checked) {
                  formik.setFieldValue("max_weight", 0);
                } else {
                  formik.setFieldValue("max_weight", "");
                }
                formik.setFieldValue("show_max_weight", event.currentTarget.checked);
              }}
              color="primary"
              inputProps={{'aria-label': 'controlled'}}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <InputField
              error={Boolean(formik.touched.max_weight && formik.errors.max_weight)}
              fullWidth
              disabled={!formik.values.show_max_weight}
              helperText={formik.touched.max_weight && formik.errors.max_weight}
              label="Maximum Weight (g)"
              name="max_weight"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.max_weight}
              type={"number"}
            />
          </Grid>

          <Grid item xs={3} sm={2}>
            <br/>
            <Switch
              checked={formik.values.show_min_distance}
              onChange={event => {
                if (event.currentTarget.checked) {
                  formik.setFieldValue("min_distance", 0);
                } else {
                  formik.setFieldValue("min_distance", "");
                }
                formik.setFieldValue("show_min_distance", event.currentTarget.checked);
              }}
              color="primary"
              inputProps={{'aria-label': 'controlled'}}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <InputField
              error={Boolean(formik.touched.min_distance && formik.errors.min_distance)}
              fullWidth
              disabled={!formik.values.show_min_distance}
              helperText={formik.touched.min_distance && formik.errors.min_distance}
              label="Minimum Distance (m)"
              name="min_distance"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.min_distance}
              type={"number"}
            />
          </Grid>

          <Grid item xs={3} sm={2}>
            <br/>
            <Switch
              checked={formik.values.show_max_distance}
              onChange={event => {
                if (event.currentTarget.checked) {
                  formik.setFieldValue("max_distance", 0);
                } else {
                  formik.setFieldValue("max_distance", "");
                }
                formik.setFieldValue("show_max_distance", event.currentTarget.checked);
              }}
              color="primary"
              inputProps={{'aria-label': 'controlled'}}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <InputField
              error={Boolean(formik.touched.max_distance && formik.errors.max_distance)}
              fullWidth
              disabled={!formik.values.show_max_distance}
              helperText={formik.touched.max_distance && formik.errors.max_distance}
              label="Maximum Distance (m)"
              name="max_distance"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.max_distance}
              type={"number"}
            />
          </Grid>

          {(formik.values.show_min_distance || formik.values.show_max_distance) && <Grid item xs={12}>
            <LocationFinder location={loc}
                            markers={[]}
                            updateLocation={(data) => setLoc(data)}
                            width={'100%'}
                            height={530}/>
          </Grid>}

          <Grid item xs={12}>
            <Box sx={{mb: 1}}>
              {formik.values.postcodes?.map((pc, index) => (<Chip key={"postcode-"+pc+index}
                      style={{margin: '3px'}}
                      label={pc}
                      variant={"filled"}
                      color={"primary"}
                      onDelete={() => {
                        formik.setFieldValue("postcodes", [...formik.values.postcodes.filter(p => p !== pc)]);
                      }}
                      deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={3} sm={2}>
            <br/>
            <Switch
              checked={formik.values.show_postcodes}
              onChange={event => {
                formik.setFieldValue("postcodes", []);
                setPostcode("")
                formik.setFieldValue("show_postcodes", event.currentTarget.checked);
              }}
              color="primary"
              inputProps={{'aria-label': 'controlled'}}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <FormControl sx={{mt: 1}} fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-postcodes">Add postcode</InputLabel>
              <OutlinedInput
                id="outlined-adornment-postcodes"
                fullWidth
                label="Add postcode"
                name="postcodes"
                disabled={!formik.values.show_postcodes}
                onBlur={formik.handleBlur}
                onChange={(event) => setPostcode(event.currentTarget.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    if (postcode.length > 0) {
                      formik.setFieldValue("postcodes", [...formik.values.postcodes, postcode]);
                      setPostcode("")
                    }
                  }
                }}
                value={postcode}
                type={"text"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        if (formik.values.show_postcodes && postcode.length > 0) {
                          formik.setFieldValue("postcodes", [...formik.values.postcodes, postcode]);
                          setPostcode("")
                        }
                      }}
                      edge="end"
                    >
                      <Plus/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
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
          {initialValues ? 'Update Delivery Rule' : 'Create Delivery Rule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeliveryRuleDialog.defaultProps = {
  open: false
};

DeliveryRuleDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
