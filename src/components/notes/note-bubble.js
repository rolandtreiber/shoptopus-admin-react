import React from "react";
import {styled} from "@material-ui/core/styles";

const Bubble = styled('div')(({ theme }) => ({
  alignItems: 'left',
  backgroundColor: theme.palette.neutral[100],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(1),
  borderRadius: 10,
  marginBottom: 5
}));

const NoteBubble = ({note}) => {
  return (
    <Bubble>
      <div dangerouslySetInnerHTML={{__html: note.note}}/>
    </Bubble>
  )
}

export default NoteBubble