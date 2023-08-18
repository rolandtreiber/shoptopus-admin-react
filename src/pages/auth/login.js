import {useContext, useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Card, CardContent, Container, Grid, Toolbar } from '@material-ui/core';
import { Logo } from '../../components/common/logo';
import {SettingsContext, useSettings} from '../../contexts/settings-context';
import gtm from '../../lib/gtm';
import {LoginOAuth} from "../../components/auth/login-oauth";

export const Login = () => {
  const { settings } = useSettings();
  const {appName} = useContext(SettingsContext)

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | {appName}</title>
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
                  sx={{ backgroundColor: 'background.default' }}
                  elevation={0}
                >
                  <CardContent>
                    <LoginOAuth />
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
