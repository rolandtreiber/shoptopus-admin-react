import {useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import {Link as RouterLink, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  FormHelperText,
  Grid,
  Toolbar
} from '@material-ui/core';
import { InputField } from '../../components/common/input-fields/input-field';
import { Logo } from '../../components/common/logo';
import TrButton from "../../components/common/translated/translated-button";
import {SettingsContext, useSettings} from '../../contexts/settings-context';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {TrTypography} from "../../components/common/translated/translated-typography";

export const PasswordReset = () => {
  const mounted = useMounted();
  const { passwordReset } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const {appName} = useContext(SettingsContext)
  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      password: Yup
        .string()
        .min(7, 'Must be at least 7 characters')
        .max(255)
        .required('Required'),
      passwordConfirm: Yup
        .string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        const result = await passwordReset?.({email: email, token: token, password: values.password, password_confirmation: values.passwordConfirm});
        if (result?.data?.data?.message?.indexOf('success') !== -1) {
          setSubmitted(true)
        }
      } catch (err) {
        console.error(err);
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }
    }
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const showAlert = location.state?.username;

  return (
    <>
      <Helmet>
        <title>Password Reset | {appName}</title>
      </Helmet>
      <AppBar
        elevation={0}
        sx={{ backgroundColor: 'background.paper' }}
      >
        <Container maxWidth="md">
          <Toolbar
            disableGutters
            sx={{ height: 64 }}
          >
            <RouterLink to="/">
              <Logo variant={settings.theme === 'dark' ? 'light' : 'dark'} />
            </RouterLink>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          pt: '64px'
        }}
      >
        <Box sx={{ py: 9 }}>
          <Container maxWidth="md">
            {showAlert && (
              <Alert
                severity="success"
                sx={{ mb: 3 }}
                variant="filled"
              >
                If this email address was used to create an account,
                instructions to reset your password will be sent to you.
              </Alert>
            )}
            <Grid
              container
              spacing={6}
            >
              <Grid
                item
                md={8}
                xs={12}
              >
                <Card
                  sx={{ backgroundColor: 'background.default' }}
                  elevation={0}
                >
                  <CardContent>
                    {token && email && !submitted && <form onSubmit={formik.handleSubmit}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          mb: 3
                        }}
                      >
                        <TrTypography
                          color="textPrimary"
                          variant="h4"
                        >
                          Reset Password
                        </TrTypography>
                        <Box sx={{ flexGrow: 1 }} />
                        <TrButton
                          color="primary"
                          component={RouterLink}
                          to="/login"
                          variant="text"
                        >
                          Sign in
                        </TrButton>
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
                            error={Boolean(formik.touched.password
                              && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label="Password"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <InputField
                            error={Boolean(formik.touched.passwordConfirm
                              && formik.errors.passwordConfirm)}
                            fullWidth
                            helperText={formik.touched.passwordConfirm
                            && formik.errors.passwordConfirm}
                            label="Password Confirmation"
                            name="passwordConfirm"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.passwordConfirm}
                          />
                        </Grid>
                        {formik.errors.submit && (
                          <Grid
                            item
                            xs={12}
                          >
                            <FormHelperText error>
                              {formik.errors.submit}
                              Something went wrong.
                            </FormHelperText>
                          </Grid>
                        )}
                        <Grid
                          item
                          xs={12}
                        >
                          <TrButton
                            color="primary"
                            disabled={formik.isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                          >
                            Reset password
                          </TrButton>
                        </Grid>
                      </Grid>
                    </form>}
                    {(!email || !token) && (<Grid
                          container
                          spacing={2}
                        >
                          <Grid
                            item
                            xs={12}
                          >
                            <TrTypography
                              color="textPrimary"
                              variant="h4"
                            >
                              Invalid url
                            </TrTypography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                          >
                            <TrTypography
                              color="textPrimary"
                              variant="body1"
                            >
                              One or more of the required url parameters is missing. Please click on the link in the password recovery email to access this page.
                            </TrTypography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                          >
                            <TrButton
                              color="primary"
                              onClick={() => {
                                navigate('/login')
                              }}
                              variant="text"
                            >
                              Login
                            </TrButton>
                          </Grid>
                        </Grid>)}
                    {submitted && <>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          item
                          xs={12}
                        >
                          <TrTypography
                            color="textPrimary"
                            variant="h4"
                          >
                            Your password was updated successfully
                          </TrTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <TrTypography
                            color="textPrimary"
                            variant="body1"
                          >
                            You can now sign in with your new password.
                          </TrTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <TrButton
                            color="primary"
                            onClick={() => {
                              navigate('/login', {
                                state: {
                                  username: email
                                }
                              });
                            }}
                            variant="text"
                          >
                            Login
                          </TrButton>
                        </Grid>
                      </Grid>
                    </>}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};
