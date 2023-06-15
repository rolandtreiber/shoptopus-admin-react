import React, {useState, createContext, useEffect, createRef, useContext, useMemo, useCallback} from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Table, TableBody, TableRow, TableCell, TextField, Alert, DialogActions, CircularProgress
} from '@material-ui/core';
import {Delete, Send} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import {NotificationsContext} from "./notifications-context";
import GenericDialogModal from "../components/modal/generic-dialog-modal";
import {APIContext} from "./api-context";
import {useMounted} from "../hooks/use-mounted";
import {SettingsContext} from "./settings-context";
import '../static/css/wysiwyg.css';
import NoteBubble from "../components/notes/note-bubble";

export const NoteContext = createContext();

const toolbar = {
  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
}

export const NoteProvider = ({children}) => {
  const {getUserOptions, sendEmail} = useContext(APIContext)
  const [notes, setNotes] = useState([])
  const [noteableId, setNoteableId] = useState([])
  const [noteableType, setNoteableType] = useState([])
  const [body, setBody] = useState('<p></p>')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [modalVisibility, setModalVisibility] = useState(false)
  const [working, setWorking] = useState(false)
  const editorRef = createRef()
  const {toast} = useContext(NotificationsContext)[0]
  const [confirmationDialogVisibility, setConfirmationDialogVisibility] = useState(false)
  const [errors, setErrors] = useState({})
  const mounted = useMounted();
  const {theme} = useContext(SettingsContext)

  const setEditorStateFromHtml = (initialBody) => {
    const content = htmlToDraft(initialBody);
    const contentBlocks = content.contentBlocks;
    const contentEntityMap = content.entityMap;
    const contentState = ContentState.createFromBlockArray(contentBlocks, contentEntityMap);
    const editorStateLocal = EditorState.createWithContent(contentState);
    setEditorState(editorStateLocal)
  }

  const handleBodyChange = (e) => {
    setEditorState(e)
    setBody(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  const handleCreateNote = () => {
    setConfirmationDialogVisibility(false)
  }

  const noteContextMethods = useMemo(() => ({
    setInitialBody: (body) => {
      setBody(body)
      setEditorStateFromHtml(body)
    },
    showNoteClient: () => {
      setModalVisibility(true)
    }
  }), [])

  return (
    <NoteContext.Provider value={[notes, {
      ...noteContextMethods,
      setNoteableId,
      setNoteableType,
      setNotes
    }]}>
      <GenericDialogModal
        onClose={() => setConfirmationDialogVisibility(false)}
        open={confirmationDialogVisibility}
        title="Are you sure?"
        description={"You are about to send one or more emails."}
        onProceed={handleCreateNote}
      />
      <Dialog
        onClose={() => setModalVisibility(false)}
        open={modalVisibility}
      >
        <DialogTitle>
          Notes
        </DialogTitle>
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
                      {notes.map((n) => <NoteBubble note={n}/>)}
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
                  {mounted.current && <Editor
                    toolbarClassName={theme === 'dark' ? "wysiwyg-toolbar-dark" : "wysiwyg-toolbar-light"}
                    wrapperClassName={theme === 'dark' ? "wysiwyg-toolbar-wrapper-dark" : "wysiwyg-toolbar-wrapper-light"}
                    editorClassName={theme === 'dark' ? "wysiwyg-toolbar-editor-dark" : "wysiwyg-toolbar-editor-light"}
                    ref={editorRef}
                    editorState={editorState}
                    toolbar={toolbar}
                    onEditorStateChange={(e) => handleBodyChange(e)}
                  />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align={"right"}>
                  <Button
                    color="primary"
                    onClick={() => setModalVisibility(false)}
                    variant="outlined"
                    sx={{
                      marginRight: 2
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={working}
                    color="primary"
                    onClick={() => validate(() => setConfirmationDialogVisibility(true))}
                    variant="contained"
                    startIcon={working ? <CircularProgress size={12}/> : <Send/>}>
                    Send
                  </Button>
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