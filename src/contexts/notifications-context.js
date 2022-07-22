import React, {createContext, useCallback, useEffect, useState} from "react";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import {ArrowCircleDown, Block, PersonAddAlt, ShoppingCart} from "@material-ui/icons";

export const NotificationsContext = createContext();

export const NotificationsProvider = (props) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationTypes = {
    "new-order": {
      "title": "New order placed!",
      "icon": ShoppingCart,
      "iconColor": '#0051ff'
    },
    "product-out-of-stock": {
      "title": "Product out of stock",
      "icon": Block,
      "iconColor": '#ff0000'
    },
    "product-running-low": {
      "title": "Product stock running low",
      "icon": ArrowCircleDown,
      "iconColor": '#ffb400'
    },
    "user-signup": {
      "title": "New user signup",
      "icon": PersonAddAlt,
      "iconColor": '#08ff00'
    }
  }

  useEffect(() => {
    let unread = 0
    notifications.forEach(n => {
      if (n.read === false) {
        unread++
      }
    })
    setUnreadCount(unread)
  }, [notifications])

  const addSocketNotificationToList = useCallback((rawNotification) => {
    const newNotifications = [{
      id: rawNotification.id,
      content: rawNotification.message,
      read: false,
      title: notificationTypes[rawNotification.type].title,
      icon: notificationTypes[rawNotification.type].icon,
      iconColor: notificationTypes[rawNotification.type].iconColor
    }, ...notifications];
    setNotifications(newNotifications)
    toast.success(rawNotification.message);
  }, [notifications])

  const setNotificationsFromServer = useCallback((rawNotifications) => {
    setNotifications(rawNotifications.map(n => {
      return {
        id: n.id,
        content: n.data.message,
        read: n.read,
        title: notificationTypes[n.type].title,
        icon: notificationTypes[n.type].icon,
        iconColor: notificationTypes[n.type].iconColor
      }
    }))
  }, [notifications])

  const setAllRead = () => {
    setNotifications([...notifications.map(item => {
      item.read = true
      return item
    })])
  }

  return (
    <NotificationsContext.Provider value={[{toast, notifications, unreadCount}, {setNotificationsFromServer, setNotifications, setAllRead, addSocketNotificationToList}]}>
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