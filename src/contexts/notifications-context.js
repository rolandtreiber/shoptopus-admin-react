import React, {createContext, useState} from "react";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

export const NotificationsContext = createContext();

export const NotificationsProvider = (props) => {
  const [notifications, setNotifications] = useState([])

  const setAllRead = () => {
    setNotifications([...notifications.map(item => {
      item.read = true
      return item
    })])
  }

  return (
    <NotificationsContext.Provider value={[{toast, notifications}, {setNotifications, setAllRead}]}>
      {props.children}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover/>
    </NotificationsContext.Provider>
  )
}