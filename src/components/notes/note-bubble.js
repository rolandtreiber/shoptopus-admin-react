import React, {useState} from "react";
import {styled} from "@material-ui/core/styles";
import RichTextEditor from "../rich-text-editor/rich-text-editor";
import {Button} from "@material-ui/core";
import GenericDialogModal from "../modal/generic-dialog-modal";
import {ConfirmationDialog} from "../confirmation-dialog";

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
  const [deleteNoteConfirmationDialogVisibility, setDeleteNoteConfirmationDialogVisibility] = useState(false)
  const [updateNoteConfirmationDialogVisibility, setUpdateNoteConfirmationDialogVisibility] = useState(false)

  const handleEditButtonClicked = () => {
    if (editable) {
      setUpdateNoteConfirmationDialogVisibility(true)
    } else {
      setEditable(!editable)
    }
  }

  return (
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
      {editable ? (<RichTextEditor initialContent={initialContent} setContent={setContent}/>) : (<div dangerouslySetInnerHTML={{__html: note.note}}/>)}
      <div>
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
      </div>
    </Bubble>
  )
}

export default NoteBubble