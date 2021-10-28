import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import { CheckCircleOutlined as CheckCircleIcon } from '../../icons/check-circle-outlined';

const features = [
  'Authentication Services',
  'Dashboard Reports',
  'Advanced Filters',
  'Customers Management',
  'Products Management',
  'Inventory Management'
];

const auth = [
  {
    icon: '/static/amplify.png',
    iconWidth: 30,
    name: 'Amplify'
  },
  {
    icon: '/static/auth0.png',
    iconWidth: 20,
    name: 'Auth0'
  },
  {
    icon: '/static/firebase.png',
    iconWidth: 16,
    name: 'Firebase'
  },
  {
    icon: '/static/jwt.png',
    iconWidth: 22,
    name: 'JWT'
  }
];

export const ProductFeatures = () => (
  <div>
    <Typography
      color="textPrimary"
      variant="h4"
    >
      Carpatin - Admin Dashboard
    </Typography>
    <Typography
      color="textSecondary"
      sx={{
        mb: 3,
        mt: 1
      }}
      variant="body2"
    >
      Save thousands of people-hours with our ready-to-deploy retail dashboard template.
    </Typography>
    <List sx={{ py: 2 }}>
      {features.map((feature) => (
        <ListItem
          disableGutters
          key={feature}
        >
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              mr: 1
            }}
          >
            <CheckCircleIcon sx={{ color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText primary={feature} />
        </ListItem>
      ))}
    </List>
    <Divider />
    <Typography
      color="textPrimary"
      sx={{
        mb: 2,
        mt: 3
      }}
      variant="h5"
    >
      Auth services
    </Typography>
    <Typography
      color="textSecondary"
      sx={{ mb: 2 }}
      variant="body2"
    >
      The template comes with Amplify, Firebase, Auth0, JWT auth systems
      installed and configured. Get up and running in minutes.
    </Typography>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        '& img': {
          ml: 1
        }
      }}
    >
      {auth.map((item) => (
        <Box
          key={item.name}
          sx={{
            alignItems: 'center',
            display: 'flex',
            '& + &': {
              ml: 3
            }
          }}
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {item.name}
          </Typography>
          <img
            alt={item.name}
            src={item.icon}
            style={{ maxWidth: item.iconWidth }}
          />
        </Box>
      ))}
    </Box>
  </div>
);
