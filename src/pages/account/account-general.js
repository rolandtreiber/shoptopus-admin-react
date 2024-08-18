import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@material-ui/core';
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import { AccountDetails } from './components/account-details';
import { AccountChangePassword } from './components/account-change-password';
import { Account2FA } from './components/account-2fa';
import gtm from '../../lib/gtm';
import {SettingsContext} from "../../contexts/settings-context";

export const AccountGeneral = () => {
  const {appName} = useContext(SettingsContext)
  const [userDetails, setUserDetails] = useState({isLoading: true})
  const mounted = useMounted();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const {
    fetchAuthenticatedUserAccountDetails,
  } = useContext(APIContext)

  const getUserDetails = useCallback(async (clearWhileLoading = true) => {
    clearWhileLoading && setUserDetails(() => ({isLoading: true}));

    try {
      const result = await fetchAuthenticatedUserAccountDetails()

      if (mounted.current) {
        setUserDetails(() => ({
          isLoading: false,
          data: result.data[0],
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setUserDetails(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [mounted]);

  useEffect(() => {
    getUserDetails().catch(console.error);
  }, []);

  return (
    <>
      <Helmet>
        <title>Account: General | {appName}</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <AccountDetails accountDetails={userDetails} />
        <AccountChangePassword sx={{ my: 3 }} />
        <Account2FA />
      </Box>
    </>
  );
};
