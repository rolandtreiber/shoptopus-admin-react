import { useFormik } from 'formik';
import {useContext} from "react";
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid, MenuItem,
} from '@material-ui/core';
import { InputField } from '../../../components/common/input-fields/input-field';
import TrButton from "../../../components/common/translated/translated-button";
import {TrTypography} from "../../../components/common/translated/translated-typography";
import {SettingsContext} from "../../../contexts/settings-context";

export const AccountDetails = (props) => {
  const {accountDetails} = props
  const {availableUserPrefixes} = useContext(SettingsContext)

  const formik = useFormik({
    initialValues: {
      email: accountDetails.email,
      firstName: accountDetails.first_name,
      lastName: accountDetails.last_name,
      title: accountDetails.title,
      submit: null
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      firstName: Yup.string().max(255).required('First Name is required'),
      lastName: Yup.string().max(255).required('Last Name is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        toast.success('Settings saved_');
        helpers.resetForm();
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <CardContent>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            md={5}
            xs={12}
          >
            <TrTypography
              color="textPrimary"
              variant="h6"
            >
              Settings
            </TrTypography>
          </Grid>
          <Grid
            item
            md={7}
            xs={12}
          >
            <form onSubmit={formik.handleSubmit}>
              <div>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    pb: 3
                  }}
                >
                  <Avatar
                    src={accountDetails.avatar.url}
                    sx={{
                      height: 64,
                      mr: 2,
                      width: 64
                    }}
                  />
                  <div>
                    <Grid
                      container
                      spacing={1}
                      sx={{ pb: 1 }}
                    >
                      <Grid item>
                        <TrButton
                          color="primary"
                          size="small"
                          type="button"
                          variant="outlined"
                        >
                          Upload new picture
                        </TrButton>
                      </Grid>
                      <Grid item>
                        <TrButton
                          color="primary"
                          size="small"
                          type="button"
                          variant="text"
                        >
                          Delete
                        </TrButton>
                      </Grid>
                    </Grid>
                    <TrTypography
                      color="textSecondary"
                      variant="caption"
                    >
                      Recommended dimensions: 200x200, maximum file size: 5MB
                    </TrTypography>
                  </div>
                </Box>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={2}
                  >
                    <InputField
                      error={Boolean(formik.touched.title
                        && formik.errors.title)}
                      fullWidth
                      helperText={formik.touched.title && formik.errors.title}
                      label="Title"
                      name="title"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      select
                      value={formik.values.title}
                    >
                      {availableUserPrefixes.map((prefix) => (
                        <MenuItem
                          key={prefix}
                          value={prefix}
                        >
                          {prefix}
                        </MenuItem>
                      ))}
                    </InputField>
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
                  <Grid
                    item
                    xs={5}
                  >
                    <InputField
                      error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                      fullWidth
                      helperText={formik.touched.firstName && formik.errors.first}
                      label="First Name"
                      name="firstName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={5}
                  >
                    <InputField
                      error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                      fullWidth
                      helperText={formik.touched.lastName && formik.errors.first}
                      label="Last Name"
                      name="lastName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <InputField
                      error={Boolean(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label="Email address"
                      name="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="email"
                      value={formik.values.email}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <TrButton
                      color="primary"
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Save settings
                    </TrButton>
                  </Grid>
                </Grid>
              </div>
            </form>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
