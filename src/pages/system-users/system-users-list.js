import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import {AuthContext} from "../../contexts/oauth-context";
import {useMounted} from "../../hooks/use-mounted";
import {useContext, useState} from "react";
import {SettingsContext} from "../../contexts/settings-context";

export const SystemUsersList = () => {
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({isLoading: true})
  const {can} = useContext(AuthContext)

  return can('payments.can.list') ? (<h1>System Users List</h1>) : (<MissingPermission/>)
}
