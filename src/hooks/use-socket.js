import React, {useEffect, useState} from 'react'
import Pusher from "pusher-js";
import Echo from "laravel-echo";

const useSocket = (token) => {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const options = {
      broadcaster: "pusher",
      key: process.env.REACT_APP_PUSHER_KEY,
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      forceTLS: true,
      encrypted: false,
      authEndpoint: process.env.REACT_APP_BROADCAST_AUTH,
      auth: {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    };
    setSocket(new Echo(options));

    return () => {
      setSocket(null)
    }
  }, [token])

  return socket
}

export default useSocket