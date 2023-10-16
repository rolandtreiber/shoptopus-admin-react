import {useMounted} from "../../hooks/use-mounted";
import {useCallback, useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../contexts/settings-context";
import {APIContext} from "../../contexts/api-context";
import {useTranslation} from "react-i18next";
import {Box, Button, Container, Divider, Tab, Tabs, Typography} from "@material-ui/core";
import {Outlet, Link as RouterLink, useLocation} from "react-router-dom";
import {snakeToCapitalised} from "../../utils/string-operations";
import {Helmet} from "react-helmet-async";
import {Plus as PlusIcon} from "../../icons/plus";
import RoleDialog from "../../components/page-components/roles-and-permissions/role-dialog";

export const RolesAndPermissions = () => {
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const location = useLocation();
  const {fetchRoles, fetchPermissions, saveRole, updateRole} = useContext(APIContext)
  const [rolesState, setRolesState] = useState({
    isLoading: true,
    data: []
  })
  const [permissionsState, setPermissionsState] = useState({
    isLoading: true,
    data: null
  })
  const [tabValue, setTabValue] = useState(0)
  const [roleId, setRoleId] = useState(0)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState()
  const [selectedRoleName, setSelectedRoleName] = useState()
  const {t} = useTranslation();
  const [tabs, setTabs] = useState([
    {
      href: '/admin/roles-and-permissions',
      label: 'General'
    },
  ]);

  const getRoles = useCallback(async () => {
    setRolesState(() => ({isLoading: true, data: null}));

    try {
      const {data: {data}} = await fetchRoles()
      const result = data;

      if (mounted.current) {
        setRolesState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setRolesState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);


  const getPermissions = useCallback(async () => {
    setPermissionsState(() => ({isLoading: true, data: null}));

    try {
      const {data: {data}} = await fetchPermissions()
      const result = data;

      if (mounted.current) {
        setPermissionsState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setPermissionsState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  const handleSaveRole = useCallback(async (name) => {
    if (selectedRoleId) {
      updateRole(selectedRoleId, {
        name: name
      }).then(() => {
        getRoles().catch(console.error);
      })
    } else {
      saveRole({
        name: name
      }).then(() => {
        getRoles().catch(console.error);
      })
    }
  }, [selectedRoleId])

  useEffect(() => {
    getRoles().catch(console.error);
    getPermissions().catch(console.error);
  }, []);

  useEffect(() => {
    if (rolesState.data) {
      setTabs([
        {
          href: '/admin/roles-and-permissions',
          label: 'General'
        },
        ...rolesState.data.map(r => {
          return {
            href: '/admin/roles-and-permissions/' + r.name,
            label: snakeToCapitalised(r.name)
          }
        })
      ])

    }
  }, [rolesState])

  useEffect(() => {
    const value = tabs.findIndex((tab) => tab.href === location.pathname)
    setTabValue(value !== -1 ? value : 0)
  }, [tabs, location]);

  useEffect(() => {
    if (tabValue !== 0 && tabValue !== -1) {
      const role = rolesState.data[tabValue-1]
      if (role.id) {
        setRoleId(role.id)
        console.log(role.id)
      }
    }
  }, [tabValue])

  const editRoleName = (id) => {
    setSelectedRoleId(id)
    setSelectedRoleName(snakeToCapitalised(rolesState.data?.find(r => r.id === id)?.name))
    setShowRoleDialog(true)
  }

  return (
    <>
      <Helmet>
        <title>{t("Roles and Permissions")} | {appName}</title>
      </Helmet>
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
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {t("Roles And Permissions")}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                onClick={() => {
                  setSelectedRoleId(null)
                  setShowRoleDialog(true)
                }}
                size="large"
                startIcon={<PlusIcon fontSize="small" />}
                variant="contained"
              >
                {t('Add Role')}
              </Button>
            </Box>
          </Box>
            {rolesState.isLoading === false && <Tabs
              allowScrollButtonsMobile
              sx={{mt: 4}}
              value={tabValue}
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
            </Tabs>}
            <Divider/>
          <Outlet context={[roleId, permissionsState, editRoleName]}/>
        </Container>
        <RoleDialog
          open={showRoleDialog}
          onClose={() => setShowRoleDialog(false)}
          roleId={selectedRoleId}
          roleName={selectedRoleName}
          setSelectedRoleId={setSelectedRoleId}
          onSubmitted={(name) => handleSaveRole(name)}
        />
      </Box>
    </>
  )
}
