import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, Box, Card, Typography } from '@material-ui/core';
import TrButton from "../../../components/common/translated/translated-button";

export const CustomerNote = (props) => {
  const {
    content,
    createdAt,
    id,
    onDelete,
    senderAvatar,
    senderName,
    deletable,
    sx,
    ...other
  } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        p: 2,
        ...sx
      }}
      variant="outlined"
      {...other}
    >
      <Avatar src={senderAvatar} />
      <Box
        sx={{
          flex: 1,
          ml: 2
        }}
      >
        <Typography
          color="textPrimary"
          variant="h6"
        >
          {senderName}
        </Typography>
        <Typography
          color="textPrimary"
          sx={{ my: 1 }}
          variant="body2"
        >
          {content}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {`${formatDistanceToNowStrict(createdAt)} ago`}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {deletable && (
            <TrButton
              color="primary"
              onClick={() => onDelete?.(id)}
              size="small"
              variant="text"
            >
              Delete
            </TrButton>
          )}
        </Box>
      </Box>
    </Card>
  );
};

CustomerNote.propTypes = {
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  deletable: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  senderAvatar: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
  sx: PropTypes.object
};
