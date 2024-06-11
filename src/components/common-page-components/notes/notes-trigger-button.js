import {useContext, useEffect} from "react";
import IconButton from "@material-ui/core/IconButton";
import {Summarize} from "@material-ui/icons";
import {NoteContext} from "../../../contexts/note-context";
import {Badge} from "@material-ui/core";

const NotesTriggerButton = ({noteableType, noteableId, notes, updatedCallback}) => {
  const {
    setNotes,
    setNoteableType,
    setNoteableId,
    setInitialContent,
    showNoteClient,
    setUpdatedCallback
  } = useContext(NoteContext)[1]

  const initNotesModal = () => {
    setInitialContent('<p></p>')
    setNoteableType(noteableType)
    setNoteableId(noteableId)
    setUpdatedCallback(updatedCallback)
    showNoteClient()
  }

  useEffect(() => {
    if (notes) setNotes(notes)
  }, [notes])

  return (
    <IconButton onClick={initNotesModal}>
      <Badge badgeContent={notes.length > 0 ? notes.length : null} color="secondary">
        <Summarize />
      </Badge>
    </IconButton>
  )
}

export default NotesTriggerButton