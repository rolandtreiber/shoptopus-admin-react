import React, {useCallback, useContext, useEffect} from "react";
import useSocket from "../../../../hooks/use-socket";
import {useAuth} from "../../../../hooks/use-auth";
import {NotificationsContext} from "../../../../contexts/notifications-context";

const notifications = () => {
  const {accessToken, user} = useAuth()
  const socket = useSocket(accessToken)
  const [{notifications}, {addSocketNotificationToList}] = useContext(NotificationsContext)

  useEffect(() => {
    socket && socket.private("user-"+user.id+"-notifications").listen(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", data => {
      socket.leave("user-"+user.id+"-notifications")
      addSocketNotificationToList(data)
    });

    return () => {
      socket && socket.leave("user-"+user.id+"-notifications")
    }
  }, [socket, user, notifications])

  return (
    <div/>
  )
}

export default notifications