import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Typography
} from '@material-ui/core';
import { InputField } from '../input-field';

const companySizeOptions = ['1-10', '11-30', '31-50', '50+'];

export const AccountDetails = (props) => {
  const formik = useFormik({
    initialValues: {
      companyName: 'ACME Corp LLC.',
      companySize: '1-10',
      email: 'chen.simmons@acmecorp.com',
      fullName: 'Chen Simmons',
      jobTitle: 'Operation',
      submit: null
    },
    validationSchema: Yup.object().shape({
      companyName: Yup.string().max(255).required('Company name is required'),
      companySize: Yup
        .string()
        .max(255)
        .oneOf(companySizeOptions)
        .required('Company size is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      fullName: Yup.string().max(255).required('Full Name is required'),
      jobTitle: Yup.string().max(255).required('Job name is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        toast.success('Settings saved');
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
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Settings
            </Typography>
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
                    src="/static/user-chen_simmons.png"
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
                        <Button
                          color="primary"
                          size="small"
                          type="button"
                          variant="outlined"
                        >
                          Upload new picture
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          color="primary"
                          size="small"
                          type="button"
                          variant="text"
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                    >
                      Recommended dimensions: 200x200, maximum file size: 5MB
                    </Typography>
                  </div>
                </Box>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                  >
                    <InputField
                      error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                      fullWidth
                      helperText={formik.touched.fullName && formik.errors.fullName}
                      label="Full Name"
                      name="fullName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.fullName}
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
                    <InputField
                      error={Boolean(formik.touched.jobTitle && formik.errors.jobTitle)}
                      fullWidth
                      helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                      label="Job title"
                      name="jobTitle"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.jobTitle}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <InputField
                      error={Boolean(formik.touched.companyName
                        && formik.errors.companyName)}
                      fullWidth
                      helperText={formik.touched.companyName && formik.errors.companyName}
                      label="Company name"
                      name="companyName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.companyName}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <InputField
                      error={Boolean(formik.touched.companySize
                        && formik.errors.companySize)}
                      fullWidth
                      helperText={formik.touched.companySize && formik.errors.companySize}
                      label="Company size"
                      name="companySize"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      select
                      value={formik.values.companySize}
                    >
                      {companySizeOptions.map((companySizeOption) => (
                        <MenuItem
                          key={companySizeOption}
                          value={companySizeOption}
                        >
                          {companySizeOption}
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
                    xs={12}
                  >
                    <Button
                      color="primary"
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Save settings
                    </Button>
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
