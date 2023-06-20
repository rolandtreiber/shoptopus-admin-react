import React, {useState} from "react";
import {styled} from "@material-ui/core/styles";
import RichTextEditor from "../common/rich-text-editor/rich-text-editor";
import {Button, Typography} from "@material-ui/core";
import {ConfirmationDialog} from "../modal/confirmation-dialog";
import {format} from "date-fns";
import {useAuth} from "../../hooks/use-auth";

const BubbleContainer = styled('div')(({ theme }) => ({
  alignItems: 'left',
  marginBottom: 5
}));

const InfoBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  opacity: 0.7
}));

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

const NoteBubble = ({note, handleUpdateNote, handleDeleteNote}) => {
  const [editable, setEditable] = useState(false)
  const [content, setContent] = useState(note.note)
  const initialContent = note.note
  const {user} = useAuth();
  const [deleteNoteConfirmationDialogVisibility, setDeleteNoteConfirmationDialogVisibility] = useState(false)
  const [updateNoteConfirmationDialogVisibility, setUpdateNoteConfirmationDialogVisibility] = useState(false)

  const handleEditButtonClicked = () => {
    if (editable) {
      setUpdateNoteConfirmationDialogVisibility(true)
    } else {
      setEditable(!editable)
    }
  }

  const canEdit = () => {
    if (user.roles.indexOf('super_admin') !== -1 || note.user.id === user.id) {
      return true
    }
    return false
  }

  return (
    <BubbleContainer>
      <Bubble>
        <ConfirmationDialog
          message="Are you sure you want to delete a note?"
          onCancel={() => setDeleteNoteConfirmationDialogVisibility(false)}
          onConfirm={() => {
            setDeleteNoteConfirmationDialogVisibility(false)
            handleDeleteNote(note.id)
          }}
          open={deleteNoteConfirmationDialogVisibility}
          title="Delete Note"
          variant="warning"
        />
        <ConfirmationDialog
          message="Are you sure you want to update a note?"
          onCancel={() => setUpdateNoteConfirmationDialogVisibility(false)}
          onConfirm={() => {
            setUpdateNoteConfirmationDialogVisibility(false)
            setEditable(!editable)
            handleUpdateNote(note.id, content)
          }}
          open={updateNoteConfirmationDialogVisibility}
          title="Update Note"
          variant="warning"
        />
        {editable ? (<RichTextEditor initialContent={initialContent} setContent={setContent}/>) : (<Typography dangerouslySetInnerHTML={{__html: note.note}} variant="body2" gutterBottom/>)}
        {canEdit() && <div>
          {editable && <Button
            color="primary"
            onClick={() => setEditable(false)}
            variant="text"
          >
            Cancel
          </Button>}
          <Button
            color="primary"
            onClick={handleEditButtonClicked}
            variant="text"
          >
            {editable ? "Done" : "Edit"}
          </Button>
          {!editable && (<Button
            color="primary"
            onClick={() => setDeleteNoteConfirmationDialogVisibility(true)}
            variant="text"
          >
            Delete
          </Button>)}
        </div>}
      </Bubble>
      <InfoBox>
        <Typography variant="body2" gutterBottom>{note.user?.name}</Typography>
        <Typography variant="body2" gutterBottom>{format(new Date(note.created_at), 'dd-MMM-yyyy HH:mm')}</Typography>
      </InfoBox>
    </BubbleContainer>
  )
}

export default NoteBubble