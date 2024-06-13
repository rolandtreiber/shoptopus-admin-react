import {Box, Container} from "@material-ui/core";
import {EmojiSadOutlined as EmojiSadIcon} from "../../../icons/emoji-sad-outlined";
import {TrTypography} from "../../common/translated/translated-typography";

const MissingPermission = () => {
  return (
    <Box sx={{ height: '80vh', backgroundColor: 'background.default' }}>
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
          Insufficient permission!
        </TrTypography>
        <TrTypography
          align="center"
          color="textSecondary"
          variant="body2"
        >
          The page requested cannot be shown to you due to lacking permissions.
          Please speak to an administrator.
        </TrTypography>
      </Container>
    </Box>
  )
}

export default MissingPermission