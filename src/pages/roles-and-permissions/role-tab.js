import {useNavigate, useOutletContext} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {useTranslation} from "react-i18next";
import {
  Avatar,
  Box, Button,
  Card,
  CardContent,
  CardHeader, CircularProgress,
  Divider, Grid,
  List,
  ListItem, ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Switch
} from "@material-ui/core";
import permissions from "../../data/permissions.json"
import {DialogContext} from "../../contexts/dialog-context";
import {isObject} from "formik";
import {Edit} from "@mui/icons-material";
import {Plus} from "../../icons/plus";
import {CustomUsers} from "../../icons/custom-users";
import IconButton from "@material-ui/core/IconButton";
import {Minus} from "../../icons/minus";
import RoleUserAssociationDialog
  from "../../components/page-components/roles-and-permissions/role-user-association-dialog";

export const RoleTab = () => {
  const mounted = useMounted();
  const {t} = useTranslation();
  const [roleId, permissionsState, editRoleName, reloadTabs] = useOutletContext()
  const navigate = useNavigate();
  const [showUserAssociationsDialog, setShowUserAssociationsDialog] = useState(false)
  const {
    fetchPermissionsForRole,
    removePermissionFromRole,
    assignPermissionToRole,
    fetchUsersForRole,
    assignRoleToUser,
    removeRoleFromUser,
    deleteRole
  } = useContext(APIContext)
  const [rolePermissionsState, setRolePermissionsState] = useState({
    isLoading: true,
    data: []
  })
  const [roleUsersState, setRoleUsersState] = useState({
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
  
  const getRoleUsers = useCallback(async (roleId) => {
    setRolePermissionsState(() => ({isLoading: true, data: rolePermissionsState.data}));
    
    try {
      const {data: {data}} = await fetchUsersForRole(roleId)
      const result = data;
      
      if (mounted.current) {
        setRoleUsersState(() => ({
          isLoading: false,
          data: result
        }));
        console.log(result)
      }
    } catch (err) {
      console.error(err);
      
      if (mounted.current) {
        setRoleUsersState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);
  
  useEffect(() => {
    if (roleId) {
      getRolePermissions(roleId).catch(console.error);
      getRoleUsers(roleId).catch(console.error);
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
  
  const handleRemoveUser = (userId) => {
    const call = () => removeRoleFromUser(roleId, userId).then(result => {
      if (result.status === 200) {
        setRoleUsersState({
          isLoading: false,
          data: result.data?.data
        })
      }
    })
    
    setCallback({method: call})
    setOnCancelCallback({method: () => getRolePermissions(roleId).catch(console.error)})
    setTitle('Are you sure?')
    setDescription('You are about to remove this role from a user.')
    showGenericDialog(true)
  }
  
  const handleDeleteRole = (roleId) => {
    const call = () => deleteRole(roleId).then(result => {
      if (result.status === 200) {
        reloadTabs()
        navigate("/admin/roles-and-permissions")
      }
    })
    
    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a user role.')
    showGenericDialog(true)
  }
  
  const doAssignRoleToUser = useCallback(async (userId) => {
    const result = await assignRoleToUser(roleId, userId)
    if (result.status === 200) {
      setRoleUsersState({
        isLoading: false,
        data: result.data?.data
      })
    }
  }, [roleId])
  const handleAddUserAssociation = (userId) => {
    doAssignRoleToUser(userId).then(() => {
      setShowUserAssociationsDialog(false)
    })
  }
  
  return (
    <Grid container spacing={2}>
      {permissions.isLoading === true || !rolePermissionsState.data ? (<Box sx={{py: 4}}>
        <Skeleton height={42}/>
        <Skeleton/>
        <Skeleton/>
      </Box>) : (
        <>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{mt: 2}}>
              <CardHeader title={t("Permissions")}
                          action={(
                            <>
                              {roleUsersState.isLoading === false && roleUsersState.data.length === 0 && <Button
                                disabled={rolePermissionsState.isLoading}
                                color="error"
                                onClick={() => {
                                  handleDeleteRole(roleId)
                                }}
                                size="small"
                                startIcon={<Edit fontSize="small"/>}
                                variant="contained"
                                sx={{marginRight: 2}}
                              >
                                {t('Delete Role')}
                              </Button>}
                              <Button
                                disabled={rolePermissionsState.isLoading}
                                color="primary"
                                onClick={() => {
                                  editRoleName(roleId)
                                }}
                                size="small"
                                startIcon={<Edit fontSize="small"/>}
                                variant="contained"
                              >
                                {t('Edit Role')}
                              </Button>
                            </>
                          )}
              />
              <Divider/>
              
              <CardContent>
                {permissionsState.data && permissionsState.data.map(p => (<List key={p.id}>
                  {permissions[p.name]?.display_name && (<ListItem>
                      <ListItemText>{t(permissions[p.name].display_name)}</ListItemText>
                      {rolePermissionsState.isLoading ? <CircularProgress size={20}/> : <Switch
                        edge="end"
                        onChange={(event) => handleAddOrRemovePermission(p.id, event.target.checked)}
                        checked={!rolePermissionsState.isLoading ? isObject(rolePermissionsState.data.find(rp => rp.id === p.id)) : false}
                      />}
                    </ListItem>
                  )}
                </List>))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{mt: 2}}>
              <CardHeader title={t("Users")}
                          action={<Button
                            disabled={rolePermissionsState.isLoading}
                            color="primary"
                            onClick={() => {
                              setShowUserAssociationsDialog(true)
                            }}
                            size="small"
                            startIcon={<Plus fontSize="small"/>}
                            variant="contained"
                          >
                            {t('Add')}
                          </Button>}
              />
              <CardContent>
                {roleUsersState.isLoading ? (
                  <Box sx={{py: 4}}>
                    <Skeleton height={42}/>
                    <Skeleton/>
                    <Skeleton/>
                  </Box>
                ) : (
                  <List>
                    {roleUsersState.data?.map(user => (
                      <ListItem key={user.id}>
                        <Avatar
                          src={user.avatar?.url}
                          sx={{
                            height: 36,
                            mr: 1,
                            width: 36
                          }}
                          variant="rounded"
                        >
                          <CustomUsers/>
                        </Avatar>
                        {user.name}
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleRemoveUser(user.id)}>
                            <Minus/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
      <RoleUserAssociationDialog open={showUserAssociationsDialog} roleId={roleId}
                                 onClose={() => setShowUserAssociationsDialog(false)}
                                 onSelected={(selectedUserId) => handleAddUserAssociation(selectedUserId)}/>
    
    </Grid>
  )
}