import React, {useEffect} from "react";
import useSocket from "../hooks/use-socket";
import {useAuth} from "../hooks/use-auth";
import toast from "react-hot-toast";

const notifications = () => {
  const {accessToken, user} = useAuth()
  const socket = useSocket(accessToken)

  useEffect(() => {
    socket && socket.private("user-969bfd2e-f597-458c-99b0-fbf6b0cdf225-notifications").listen(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", data => {
      toast.success(data.message);
    });

    return () => {
      socket && socket.leave("user-signup")
    }
  }, [socket, user])

  return (
    <div/>
  )
}

export default notifications