import PropTypes from 'prop-types';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useTranslation} from 'react-i18next';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Switch,
  Typography
} from '@material-ui/core';
import {InputField} from '../../common/input-field';
import {useAuth} from '../../../hooks/use-auth';
import {usePopover} from '../../../hooks/use-popover';
import {ChevronDown as ChevronDownIcon} from '../../../icons/chevron-down';
import {Logout as LogoutIcon} from '../../../icons/logout';
import {OfficeBuilding as OfficeBuildingIcon} from '../../../icons/office-building';
import {User as UserIcon} from '../../../icons/user';
import {lightNeutral} from '../../../colors';
import {useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../../contexts/settings-context";
import {snakeToCapitalised} from "../../../utils/string-operations";

export const AccountPopover = (props) => {
  const {
    currentOrganization,
    darkMode,
    onLanguageChange,
    onOrganizationChange,
    onSwitchDirection,
    onSwitchTheme,
    organizations,
    rtlDirection,
    ...other
  } = props;
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const {logout, user} = useAuth();
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const {availableLanguages} = useContext(SettingsContext)
  const [languageOptions, setLanguageOptions] = useState({en: {
      label: 'English'
    }})

  useEffect(() => {
    let languages = {}
    Object.keys(availableLanguages).map(key => languages[key] = {
      ...availableLanguages[key],
    })
    setLanguageOptions(languages)
  }, [availableLanguages])

  const handleOrganizationChange = (event) => {
    onOrganizationChange?.(event.target.value);
  };

  const handleLanguageChange = (event) => {
    onLanguageChange(event.target.value);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const userRoles = () => {
    let ur = '';
    user.roles?.map(r => {
      ur = ur + snakeToCapitalised(r) + ', '
    })
    return ur.substr(0, ur.length-2)
  }

  return (
    <>
      <Box
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          ml: 2
        }}
        {...other}
      >
        {
          user.avatar ? (
            <Avatar
              src={user.avatar.url}
              variant="rounded"
              sx={{
                height: 40,
                width: 40
              }}
            />
          ) : (
            <Avatar>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</Avatar>
          )
        }
        <Box
          sx={{
            alignItems: 'center',
            display: {
              md: 'flex',
              xs: 'none'
            },
            flex: 1,
            ml: 1,
            minWidth: 120
          }}
        >
          <div>
            <Typography
              sx={{
                color: lightNeutral[500]
              }}
              variant="caption"
            >
              {userRoles()}
            </Typography>
            <Typography
              sx={{color: 'primary.contrastText'}}
              variant="subtitle2"
            >
              {user.name}
            </Typography>
          </div>
          <ChevronDownIcon
            sx={{
              color: 'primary.contrastText',
              ml: 1
            }}
          />
        </Box>
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            width: 260,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <InputField
          fullWidth
          onChange={handleOrganizationChange}
          select
          SelectProps={{native: true}}
          value={currentOrganization.id}
          sx={{
            display: {
              md: 'none'
            },
            pt: 2,
            px: 2
          }}
        >
          {organizations.map((organization) => (
            <option
              key={organization.id}
              value={organization.id}
            >
              {organization.name}
            </option>
          ))}
        </InputField>
        <List>
          <ListItem divider>
            <ListItemAvatar>
              {
                user.avatar ? (
                  <Avatar
                    src={user.avatar.url}
                    variant="rounded"
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                ) : (
                  <Avatar>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</Avatar>
                )
              }
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={userRoles()}
            />
          </ListItem>
          <li>
            <List disablePadding>
              <ListSubheader
                sx={{
                  py: 0,
                  display: {
                    md: 'none',
                    xs: 'flex'
                  }
                }}
                disableSticky>
                App Settings
              </ListSubheader>
              <ListItem
                sx={{
                  display: {
                    md: 'none',
                    xs: 'flex'
                  }
                }}
              >
                <InputField
                  fullWidth
                  onChange={handleLanguageChange}
                  select
                  SelectProps={{native: true}}
                  value={i18n.language}
                >
                  {Object.keys(languageOptions).map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {languageOptions[option].label}
                    </option>
                  ))}
                </InputField>
              </ListItem>
              <ListItem
                sx={{
                  py: 0,
                  display: {
                    md: 'none',
                    xs: 'flex'
                  }
                }}
              >
                <Switch
                  checked={darkMode}
                  onChange={onSwitchTheme}
                />
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  Dark Mode
                </Typography>
              </ListItem>
            </List>
          </li>
          <ListItem
            button
            component={RouterLink}
            divider
            onClick={handleClose}
            to="/organization"
          >
            <ListItemIcon>
              <OfficeBuildingIcon/>
            </ListItemIcon>
            <ListItemText primary="Organization"/>
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            divider
            onClick={handleClose}
            to="/account"
          >
            <ListItemIcon>
              <UserIcon/>
            </ListItemIcon>
            <ListItemText primary="Account"/>
          </ListItem>
          <ListItem
            button
            onClick={handleLogout}
          >
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary="Log out"/>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

AccountPopover.propTypes = {
  // @ts-ignore
  currentOrganization: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onOrganizationChange: PropTypes.func.isRequired,
  onSwitchDirection: PropTypes.func.isRequired,
  onSwitchTheme: PropTypes.func.isRequired,
  organizations: PropTypes.array.isRequired,
  rtlDirection: PropTypes.bool.isRequired
};
