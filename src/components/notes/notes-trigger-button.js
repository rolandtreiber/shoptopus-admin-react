import React, {useContext} from "react";
import IconButton from "@material-ui/core/IconButton";
import {Summarize} from "@material-ui/icons";
import {NoteContext} from "../../contexts/note-context";
import {Badge} from "@material-ui/core";

const NotesTriggerButton = ({noteableType, noteableId, notes}) => {
  const {
    setNotes,
    setNoteableType,
    setNoteableId,
    setInitialBody,
    showNoteClient
  } = useContext(NoteContext)[1]

  const initNotesModal = () => {
    setInitialBody('<p></p>')
    setNotes(notes)
    setNoteableType(noteableType)
    setNoteableId(noteableId)
    showNoteClient()
  }

  return (
    <IconButton onClick={initNotesModal}>
      <Badge badgeContent={notes.length > 0 ? notes.length : null} color="secondary">
        <Summarize />
      </Badge>
    </IconButton>
  )
}

export default NotesTriggerButton