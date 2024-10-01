import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Divider, Tab, Tabs } from '@material-ui/core';
import {TrTypography} from "../../components/common/translated/translated-typography";

const tabs = [
  {
    href: '/admin/account',
    label: 'General'
  },
  {
    href: '/admin/account/notifications',
    label: 'Notifications'
  }
];

export const Account = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        flexGrow: 1
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
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
              Account Settings
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
                label={option.label}
                to={option.href}
              />
            ))}
          </Tabs>
          <Divider />
        </Box>
        <Outlet />
      </Container>
    </Box>
  );
};
