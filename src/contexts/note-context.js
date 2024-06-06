import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid, Table, TableBody, TableCell, TableRow
} from '@material-ui/core';
import {Send} from "@material-ui/icons";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TrButton from "../components/common/translated/translated-button";
import {NotificationsContext} from "./notifications-context";
import {APIContext} from "./api-context";
import {useMounted} from "../hooks/use-mounted";
import '../static/css/wysiwyg.css';
import NoteBubble from "../components/common-page-components/notes/note-bubble";
import RichTextEditor from "../components/common/rich-text-editor/rich-text-editor";
import {ConfirmationDialog} from "../components/common/modal/confirmation-dialog";
import {TrDialogTitle} from "../components/common/translated/translated-dialog-title";

export const NoteContext = createContext();

export const NoteProvider = ({children}) => {
  const {createNote, updateNote, deleteNote} = useContext(APIContext)
  const [notes, setNotes] = useState([])
  const [noteableId, setNoteableId] = useState([])
  const [noteableType, setNoteableType] = useState([])
  const [body, setBody] = useState('<p></p>')
  const [modalVisibility, setModalVisibility] = useState(false)
  const [working, setWorking] = useState(false)
  const {toast} = useContext(NotificationsContext)[0]
  const [confirmationDialogVisibility, setConfirmationDialogVisibility] = useState(false)
  const [errors, setErrors] = useState([])
  const mounted = useMounted();
  const [initialContent, setInitialContent] = useState("<p></p>")
  const [updatedCallback, setUpdatedCallback] = useState(() => {})

  const noteContextMethods = useMemo(() => ({
    showNoteClient: () => {
      setModalVisibility(true)
    }
  }), [])

  const commitCreateNote = useCallback(async () => {
    try {
      const result = await createNote({
        note: body,
        noteable_type: noteableType,
        noteable_id: noteableId
      })

      setWorking(false)
      toast.success('Note saved');
      updatedCallback.cb()
    } catch (err) {
      console.error(err);
    }
  }, [body, noteableType, noteableId])

  const commitDeleteNote = useCallback(async (id) => {
    try {
      const result = await deleteNote(id)

      updatedCallback.cb()
    } catch (err) {
      console.error(err);
    }
  }, [body, noteableType, noteableId])

  const commitUpdateNote = useCallback(async (id, content) => {
    try {
      const result = await updateNote(id, content)

      updatedCallback.cb()
    } catch (err) {
      console.error(err);
    }
  }, [body, noteableType, noteableId])

  useEffect(() => {
    if (initialContent === '') setInitialContent('<p></p>')
  }, [initialContent])
  const handleSaveNote = () => {
    setWorking(true)
    commitCreateNote()
    setInitialContent('')

    setConfirmationDialogVisibility(false)
    updatedCallback.cb()
  }

  const handleUpdateNote = (id, content) => {
    commitUpdateNote(id, content)
    updatedCallback.cb()
  }

  const handleDeleteNote = (id) => {
    commitDeleteNote(id)
    updatedCallback.cb()
  }

  const validate = (callback) => {
    let e = {}
    if (body === '<p></p>') {
      setErrors(['Content should not be empty.'])
    } else {
      callback()
    }
  }

  return (
    <NoteContext.Provider value={[notes, {
      ...noteContextMethods,
      setInitialContent,
      setNoteableId,
      setNoteableType,
      setNotes,
      setUpdatedCallback
    }]}>
      <ConfirmationDialog
        message="Are you sure you want to add a note?"
        onCancel={() => setConfirmationDialogVisibility(false)}
        onConfirm={handleSaveNote}
        open={confirmationDialogVisibility}
        title="Save Note"
        variant="warning"
      />
      <Dialog
        onClose={() => setModalVisibility(false)}
        open={modalVisibility}
      >
        <TrDialogTitle>
          Notes
        </TrDialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <Table size={"small"}>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {notes.map((n) => <NoteBubble key={n.id} note={n} handleDeleteNote={handleDeleteNote} handleUpdateNote={handleUpdateNote}/>)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Table size={"small"}>
            <TableBody>
              <TableRow>
                <TableCell>
                  {mounted.current && <RichTextEditor initialContent={initialContent} setContent={setBody}/>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align={"right"}>
                  <TrButton
                    color="primary"
                    onClick={() => setModalVisibility(false)}
                    variant="outlined"
                    sx={{
                      marginRight: 2
                    }}
                  >
                    Cancel
                  </TrButton>
                  <TrButton
                    disabled={working}
                    color="primary"
                    onClick={() => validate(() => setConfirmationDialogVisibility(true))}
                    variant="contained"
                    startIcon={working ? <CircularProgress size={12}/> : <Send/>}>
                    Save
                  </TrButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogActions>
      </Dialog>
      {children}
    </NoteContext.Provider>
  );
}