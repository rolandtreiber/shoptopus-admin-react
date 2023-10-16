import {useMounted} from "../../hooks/use-mounted";
import {useContext, useState} from "react";
import {SettingsContext} from "../../contexts/settings-context";
import {APIContext} from "../../contexts/api-context";

export const SystemUsersList = () => {
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({isLoading: true})
  const {fetchRoles, fetchPermissions} = useContext(APIContext)

  return (<h1>System Users List</h1>)
}
