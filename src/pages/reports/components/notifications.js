import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import { Cube as CubeIcon } from '../../../icons/cube';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { Users as UsersIcon } from '../../../icons/users';
import { Cash as CashIcon } from '../../../icons/cash';

export const Notifications = () => (
  <Card variant="outlined">
    <List>
      <ListItem divider>
        <ListItemIcon>
          <CubeIcon sx={{ color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText
          primary={(
            <TrTypography
              color="inherit"
              variant="body2"
            >
              <TrTypography
                color="inherit"
                component="span"
                variant="subtitle2"
              >
                3 pending orders
              </TrTypography>
              {' '}
              needs your attention.
            </TrTypography>
          )}
        />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem divider>
        <ListItemIcon>
          <UsersIcon sx={{ color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText
          primary={(
            <TrTypography
              color="inherit"
              variant="body2"
            >
              <TrTypography
                color="inherit"
                component="span"
                variant="subtitle2"
              >
                1 team notes
              </TrTypography>
              {' '}
              at the
              {' '}
              <TrTypography
                color="inherit"
                component="span"
                variant="subtitle2"
              >
                Natalie Rusell.
              </TrTypography>
            </TrTypography>
          )}
        />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <CashIcon sx={{ color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText
          primary={(
            <TrTypography
              color="inherit"
              variant="body2"
            >
              <TrTypography
                color="inherit"
                component="span"
                variant="subtitle2"
              >
                3 pending transactions
              </TrTypography>
              {' '}
              needs your attention.
            </TrTypography>
          )}
        />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  </Card>
);
