import { useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppBar, Box, Divider, IconButton, Toolbar } from '@material-ui/core';
import { ChevronDown as ChevronDownIcon } from '../../../icons/chevron-down';
import { useSettings} from '../../../contexts/settings-context';
import { Moon as MoonIcon } from '../../../icons/moon';
import { Sun as SunIcon } from '../../../icons/sun';
import TrButton from "../../common/translated/translated-button";
import { AccountPopover } from './account-popover';
import { OrganizationPopover } from './organization-popover';
import { Logo } from '../../common/logo';
import { MobileNavbarMenu } from './mobile-navbar-menu';
import { NotificationsPopover } from './notifications/notifications-popover';
import { LanguagePopover } from './laguage-popover';
import {useTheme} from "@material-ui/core/styles";

const organizations = [
  {
    id: '1',
    name: 'SHOPTOPUS'
  }
];

export const TopNavbar = () => {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { i18n, t } = useTranslation();
  const { settings, saveSettings } = useSettings();
  const [openMenu, setOpenMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(settings.theme === 'dark');
  const [rtlDirection, setRtlDirection] = useState(settings.direction === 'rtl');
  const [currentOrganization, setCurrentOrganization] = useState(organizations[0]);
  const theme = useTheme();

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    saveSettings({
      ...settings,
      language
    });
    toast.success(t('Language changed'));
  };

  const handleSwitchTheme = () => {
    saveSettings({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });

    setDarkMode(settings.theme === 'light');
  };

  const handleSwitchDirection = () => {
    saveSettings({
      ...settings,
      direction: settings.direction === 'ltr' ? 'rtl' : 'ltr'
    });

    setRtlDirection(settings.direction === 'rtl');
  };

  const handleOrganizationChange = (organizationId) => {
    const newOrganization = organizations.find((organization) => organization.id
      === organizationId);

    if (!newOrganization) {
      return;
    }

    setCurrentOrganization(newOrganization);
  };

  return (
    <AppBar
      elevation={0}
      sx={{ backgroundColor: theme.palette.background.navigation }}
    >
      <Toolbar
        disableGutters
        sx={{
          alignItems: 'center',
          display: 'flex',
          minHeight: 64,
          px: 3,
          py: 1
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Logo
            emblemOnly
            variant="light"
          />
        </Box>
        <Divider
          flexItem
          orientation="vertical"
          sx={{
            borderColor: 'rgba(255,255,255,0.1)',
            mx: 3
          }}
        />
        <OrganizationPopover
          currentOrganization={currentOrganization}
          onOrganizationChange={handleOrganizationChange}
          organizations={organizations}
          sx={{
            display: {
              md: 'flex',
              xs: 'none'
            }
          }}
        />
        <MobileNavbarMenu
          onClose={() => setOpenMenu(false)}
          open={mdDown && openMenu}
        />
        <TrButton
          endIcon={(
            <ChevronDownIcon
              fontSize="small"
              sx={{
                ml: 2,
                transition: 'transform 250ms',
                transform: openMenu ? 'rotate(180deg)' : 'none'
              }}
            />
          )}
          onClick={() => setOpenMenu(true)}
          sx={{
            color: 'primary.contrastText',
            display: {
              md: 'none',
              xs: 'flex'
            }
          }}
          variant="text"
        >
          Menu
        </TrButton>
        <Box sx={{ flexGrow: 1 }} />
        <LanguagePopover
          language={i18n.language}
          onLanguageChange={handleLanguageChange}
          sx={{
            display: {
              md: 'inline-flex',
              xs: 'none'
            }
          }}
        />
        <IconButton
          color="inherit"
          onClick={handleSwitchTheme}
          sx={{
            mx: 2,
            display: {
              md: 'inline-flex',
              xs: 'none'
            }
          }}
        >
          {darkMode
            ? <SunIcon />
            : <MoonIcon />}
        </IconButton>
        <NotificationsPopover sx={{ mr: 2 }} />
        <AccountPopover
          currentOrganization={currentOrganization}
          darkMode={darkMode}
          onLanguageChange={handleLanguageChange}
          onOrganizationChange={handleOrganizationChange}
          onSwitchDirection={handleSwitchDirection}
          onSwitchTheme={handleSwitchTheme}
          organizations={organizations}
          rtlDirection={rtlDirection}
        />
      </Toolbar>
    </AppBar>
  );
};
