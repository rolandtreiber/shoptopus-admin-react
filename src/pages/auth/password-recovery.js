import {useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormHelperText,
  Grid,
  Toolbar
} from '@material-ui/core';
import {InputField} from '../../components/common/input-fields/input-field';
import {Logo} from '../../components/common/logo';
import {SettingsContext, useSettings} from '../../contexts/settings-context';
import {useAuth} from '../../hooks/use-auth';
import {useMounted} from '../../hooks/use-mounted';
import gtm from '../../lib/gtm';
import {TrTypography} from "../../components/common/translated/translated-typography";

export const PasswordRecovery = () => {
  const mounted = useMounted();
  const {passwordRecovery} = useAuth();
  const {settings} = useSettings();
  const {appName} = useContext(SettingsContext)
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
    }),
    onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
      try {
        await passwordRecovery?.(values.email);
        setSubmitted(true)
      } catch (err) {
        console.error(err);
        if (mounted.current) {
          setStatus({success: false});
          setErrors({submit: err.message});
          setSubmitting(false);
        }
      }
    }
  });

  useEffect(() => {
    gtm.push({event: 'page_view'});
  }, []);

  return (
    <>
      <Helmet>
        <title>Password Recovery | {appName}</title>
      </Helmet>
      <AppBar
        elevation={0}
        sx={{backgroundColor: 'background.paper'}}
      >
        <Container maxWidth="md">
          <Toolbar
            disableGutters
            sx={{height: 64}}
          >
            <RouterLink to="/">
              <Logo variant={settings.theme === 'dark' ? 'light' : 'dark'}/>
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
        <Box sx={{py: 9}}>
          <Container maxWidth="md">
            <Grid
              container
              spacing={6}
            >
              <Grid
                item
                md={2}
                sx={{
                  display: {
                    md: 'block',
                    xs: 'none'
                  }
                }}
                xs={12}
              >
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <Card
                  sx={{backgroundColor: 'background.default'}}
                  elevation={0}
                >
                  <CardContent>
                    {submitted === false ? <form onSubmit={formik.handleSubmit}>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          item
                          xs={12}
                        >
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
                              Forgot password
                            </TrTypography>
                            <Box sx={{flexGrow: 1}}/>
                            <Button
                              color="primary"
                              component={RouterLink}
                              to="/login"
                              variant="text"
                            >
                              Sign in
                            </Button>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <TrTypography
                            color="textPrimary"
                            variant="body1"
                          >
                            Enter the email address you used when you
                            joined and we’ll send you instructions to reset your password.
                          </TrTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <InputField
                            autoFocus
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label="Email Address"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
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
                        <Grid
                          item
                          xs={12}
                        >
                          <Button
                            color="primary"
                            disabled={formik.isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                          >
                            Send Verification Email
                          </Button>
                        </Grid>
                      </Grid>
                    </form> : <>
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
                            Check your email
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
                            If the email you entered is in our system, we sent you an email with the instructions for
                            resetting your password. Check your inbox.
                          </TrTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                        >
                          <Button
                            color="primary"
                            onClick={() => {
                              navigate('/login', {
                                state: {
                                  username: formik.values.email
                                }
                              });
                            }}
                            variant="text"
                          >
                            Login
                          </Button>
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
