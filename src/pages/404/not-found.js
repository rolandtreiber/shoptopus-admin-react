import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container } from '@material-ui/core';
import { EmojiSadOutlined as EmojiSadIcon } from '../../icons/emoji-sad-outlined';
import {TrTypography} from "../../components/common/translated/translated-typography";

export const NotFound = () => (
  <Box sx={{ backgroundColor: 'background.default' }}>
    <Container
      maxWidth="md"
      sx={{
        px: 5,
        py: 14,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <EmojiSadIcon sx={{ color: 'text.secondary' }} />
      <TrTypography
        align="center"
        color="textPrimary"
        sx={{ my: 2 }}
        variant="h3"
      >
        Nothing here!
      </TrTypography>
      <TrTypography
        align="center"
        color="textSecondary"
        variant="body2"
      >
        The page requested does not exist.
      </TrTypography>
      <Button
        color="primary"
        component={RouterLink}
        sx={{ mt: 2 }}
        to="/"
        variant="text"
      >
        Take me home
      </Button>
    </Container>
  </Box>
);
