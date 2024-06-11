import {
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Popover, Typography
} from '@material-ui/core';
import { usePopover } from '../../../../hooks/use-popover';
import { Bell as BellIcon } from '../../../../icons/bell';
import {useContext} from "react";
import {NotificationsContext} from "../../../../contexts/notifications-context";
import {Visibility} from "@material-ui/icons";
import {Link as RouterLink} from "react-router-dom";
import {APIContext} from "../../../../contexts/api-context";
import TrButton from "../../../common/translated/translated-button";
import {TrTypography} from "../../../common/translated/translated-typography";

export const NotificationsPopover = (props) => {
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [{ notifications, unreadCount }, { setAllRead }] = useContext(NotificationsContext)
  const { clearNotifications } = useContext(APIContext)

  const clearAndClose = () => {
    clearNotifications()
    setAllRead()
    handleClose()
  }

  return (
    <>
      <Badge
        color="success"
        badgeContent={unreadCount === 0 ? null : unreadCount}
        {...props}
      >
        <IconButton
          onClick={handleOpen}
          ref={anchorRef}
          sx={{
            color: 'primary.contrastText'
          }}
        >
          <BellIcon />
        </IconButton>
      </Badge>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={clearAndClose}
        open={open}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        <List>
          <ListSubheader sx={{ py: 1 }}>
            Notifications
          </ListSubheader>
          <ListItem
            disableGutters
            divider={true}
            key={"see-all"}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              p: 2
            }}
          >
            <TrButton
              color="primary"
              component={RouterLink}
              size="large"
              startIcon={<Visibility fontSize="small" />}
              sx={{
                width: "100%"
              }}
              to={'/admin/notifications'}
            >
              See All
            </TrButton>
          </ListItem>
          {notifications.map((notification, index) => {
            const { title, content, createdAt, icon: Icon, iconColor } = notification;

            return (
              <ListItem
                disableGutters
                divider={notifications.length > index + 1}
                key={notification.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  p: 2
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Icon
                    fontSize="small"
                    sx={{ color: iconColor }}
                  />
                  <TrTypography
                    color="textPrimary"
                    sx={{
                      ml: 1.25,
                      fontWeight: notification.read ? '300' : '900'
                    }}
                    variant="body1"
                  >
                    {title}
                  </TrTypography>
                </Box>
                <TrTypography
                  color="textSecondary"
                  variant="body2"
                >
                  {content}
                </TrTypography>
                <Typography
                  color="textSecondary"
                  variant="caption"
                >
                  {createdAt}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
};
