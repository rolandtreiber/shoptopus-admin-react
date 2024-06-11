import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Footer } from '../../components/common-page-components/layout-elements/footer';
import { TopNavbar } from '../../components/common-page-components/layout-elements/top-navbar';
import { DesktopSidebarMenu } from '../../components/common-page-components/layout-elements/desktop-sidebar-menu';
import { useSettings } from '../../contexts/settings-context';
import Notifications from "../../components/common-page-components/layout-elements/notifications/notifications";
import {useContext, useEffect} from "react";
import {APIContext} from "../../contexts/api-context";
import {useAuth} from "../../hooks/use-auth";
import {NotificationsContext} from "../../contexts/notifications-context";

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  paddingTop: 64
}));

const DashboardLayoutContent = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
}));

export const DashboardLayout = () => {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { settings, saveSettings } = useSettings();
  const { getLatestNotifications } = useContext(APIContext)
  const { setNotificationsFromServer } = useContext(NotificationsContext)[1]
  const { user } = useAuth()

  const handlePinSidebar = () => {
    saveSettings({
      ...settings,
      pinSidebar: !settings.pinSidebar
    });
  };

  const fetchNotifications = async () => {
    return await getLatestNotifications()
  }

  useEffect(() => {
    fetchNotifications().then(response => setNotificationsFromServer(response.data.data))
  }, [user])

  return (
    <DashboardLayoutRoot>
      <Notifications />
      <TopNavbar />
      {!mdDown && (
        <DesktopSidebarMenu
          onPin={handlePinSidebar}
          pinned={settings.pinSidebar}
        />
      )}
      <DashboardLayoutContent
        sx={{
          ml: {
            md: settings.pinSidebar ? '270px' : '73px'
          }
        }}
      >
        <Outlet />
        <Footer />
      </DashboardLayoutContent>
    </DashboardLayoutRoot>
  );
};
