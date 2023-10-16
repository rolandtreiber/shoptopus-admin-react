import {useOutletContext} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {useTranslation} from "react-i18next";
import {
  Box, Button,
  Card,
  CardContent,
  CardHeader, CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Switch
} from "@material-ui/core";
import permissions from "../../data/permissions.json"
import {DialogContext} from "../../contexts/dialog-context";
import {isObject} from "formik";
import {Edit} from "@mui/icons-material";

export const RoleTab = () => {
  const mounted = useMounted();
  const {t} = useTranslation();
  const [roleId, permissionsState, editRoleName] = useOutletContext()
  const {fetchPermissionsForRole, removePermissionFromRole, assignPermissionToRole} = useContext(APIContext)
  const [rolePermissionsState, setRolePermissionsState] = useState({
    isLoading: true,
    data: []
  })
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription,
    setOnCancelCallback
  } = useContext(DialogContext)[1]

  const getRolePermissions = useCallback(async (roleId) => {
    setRolePermissionsState(() => ({isLoading: true, data: rolePermissionsState.data}));

    try {
      const {data: {data}} = await fetchPermissionsForRole(roleId)
      const result = data;

      if (mounted.current) {
        setRolePermissionsState(() => ({
          isLoading: false,
          data: result
        }));
        console.log(result)
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setRolePermissionsState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (roleId) {
      getRolePermissions(roleId).catch(console.error);
    }
  }, [roleId])

  const updatePermission = useCallback(async (permissionId, checked) => {
    setRolePermissionsState(() => ({...rolePermissionsState, isLoading: true}));
    try {
      if (checked) {
        return await assignPermissionToRole(roleId, permissionId);
      } else {
        return await removePermissionFromRole(roleId, permissionId);
      }
    } catch (err) {
      console.error(err);
      getRolePermissions(roleId).catch(console.error);
    }
  }, [permissionsState, roleId])

  const handleAddOrRemovePermission = (permissionId, checked) => {
    const call = () => updatePermission(permissionId, checked).then(result => {
      if (result.status === 200) {
        console.log(result.data)
        setRolePermissionsState({
          isLoading: false,
          data: result.data?.data
        })
      }
    })

    setCallback({method: call})
    setOnCancelCallback({method: () => getRolePermissions(roleId).catch(console.error)})
    setTitle('Are you sure?')
    setDescription('You are about to ' + (checked ? "provide" : "remove") + ' a permission associated by a role.')
    showGenericDialog(true)
  }

  return (
    <>
      {permissions.isLoading === true || !rolePermissionsState.data ? (<Box sx={{ py: 4 }}>
        <Skeleton height={42} />
        <Skeleton />
        <Skeleton />
      </Box>) : (
        <>
          <Card variant="outlined" sx={{mt: 2}}>
            <CardHeader title={t("Permissions")}
                        action={<Button
                          disabled={rolePermissionsState.isLoading}
                          color="primary"
                          onClick={() => {
                            editRoleName(roleId)
                          }}
                          size="large"
                          startIcon={<Edit fontSize="small" />}
                          variant="contained"
                        >
                          {t('Edit Role')}
                        </Button>}
            />
            <Divider/>

            <CardContent>
              {permissionsState.data && permissionsState.data.map(p => (<List key={p.id}>
                {permissions[p.name]?.display_name && (<ListItem>
                      <ListItemText>{t(permissions[p.name].display_name)}</ListItemText>
                  {rolePermissionsState.isLoading ? <CircularProgress size={20} /> : <Switch
                        edge="end"
                        onChange={(event) => handleAddOrRemovePermission(p.id, event.target.checked)}
                        checked={!rolePermissionsState.isLoading ? isObject(rolePermissionsState.data.find(rp => rp.id === p.id)) : false}
                      />}
                </ListItem>
                )}
              </List>))}
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}