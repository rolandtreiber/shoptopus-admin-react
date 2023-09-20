import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@material-ui/core';
import { AccountDetails } from '../../components/page-components/account/account-details';
import { AccountChangePassword } from '../../components/page-components/account/account-change-password';
import { Account2FA } from '../../components/page-components/account/account-2fa';
import gtm from '../../lib/gtm';

export const AccountGeneral = () => {
  const {appName} = useContext(SettingsContext)

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Account: General | {appName}</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <AccountDetails />
        <AccountChangePassword sx={{ my: 3 }} />
        <Account2FA />
      </Box>
    </>
  );
};
