import {useContext, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Divider, Tab, Tabs } from '@material-ui/core';
import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import {AuthContext} from "../../contexts/oauth-context";
import gtm from '../../lib/gtm';
import {TrTypography} from "../../components/common/translated/translated-typography";

const tabs = [
  {
    href: '/admin/dashboard',
    label: 'Overview'
  },
  {
    href: '/admin/dashboard/sales',
    label: 'Sales'
  }
];

export const Dashboard = () => {
  const location = useLocation();
  const {can} = useContext(AuthContext)
  const { t } = useTranslation();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return can('reports.can.see') ? (
    <Box
      sx={{
        backgroundColor: 'background.default',
        flexGrow: 1
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <TrTypography
              color="textPrimary"
              variant="h4"
            >
              Welcome
            </TrTypography>
          </Box>
          <Tabs
            allowScrollButtonsMobile
            sx={{ mt: 2 }}
            value={tabs.findIndex((tab) => tab.href === location.pathname)}
            variant="scrollable"
          >
            {tabs.map((option) => (
              <Tab
                component={RouterLink}
                key={option.href}
                label={t(option.label)}
                to={option.href}
              />
            ))}
          </Tabs>
          <Divider />
        </Box>
        <Outlet />
      </Container>
    </Box>
  ) : (<MissingPermission/>);
};
