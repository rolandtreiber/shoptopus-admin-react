import {useEffect, useState} from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Divider, Tab, Tabs, Typography } from '@material-ui/core';
import gtm from '../lib/gtm';
import LocationFinder from "../components/maps/locationfinder";

const tabs = [
  {
    href: '/dashboard',
    label: 'Overview'
  },
  {
    href: '/dashboard/sales',
    label: 'Sales'
  }
];

export const Dashboard = () => {
  const location = useLocation();
  // const [loc, setLoc] = useState({
  //   lat: 51.45,
  //   lng: -2.58,
  //   radius: 2
  // })

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
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
            <Typography
              color="textPrimary"
              variant="h4"
            >
              Welcome
            </Typography>
            {/*<LocationFinder location={loc}*/}
            {/*                markers={[]}*/}
            {/*                updateLocation={(data) => setLoc(data)}*/}
            {/*                width={'100%'}*/}
            {/*                height={530}/>*/}
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
