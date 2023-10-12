import {createContext, createRef, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent, Grid, Table, TableBody, TableCell, TableRow, TextField
} from '@material-ui/core';
import {Delete, Send} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {ContentState, EditorState, convertToRaw} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import Autocomplete from '@material-ui/core/Autocomplete';
import {Uploader} from "../components/common/uploader";
import {NotificationsContext} from "./notifications-context";
import {APIContext} from "./api-context";
import {useMounted} from "../hooks/use-mounted";
import {getFileFromBlob} from "../utils/file-operations";
import {SettingsContext} from "./settings-context";
import '../static/css/wysiwyg.css';
import {ConfirmationDialog} from "../components/modal/confirmation-dialog";
import {DialogTitleTranslated} from "../components/common/dialog-title-translated";

export const EmailClientContext = createContext();

const toolbar = {
  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
}

export const EmailClientProvider = ({children}) => {
  const {getUserOptions, sendEmail} = useContext(APIContext)
  const [addresses, setAddresses] = useState([])
  const [address, setAddress] = useState('')
  const [subject, setSubject] = useState()
  const [setTitle] = useState("Compose Email")
  const [body, setBody] = useState('<p></p>')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [modalVisibility, setModalVisibility] = useState(false)
  const [working, setWorking] = useState(false)
  const editorRef = createRef()
  const [userOptions, setUserOptions] = useState([])
  const [attachments, setAttachments] = useState([])
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

  const getUsersList = useCallback(async () => {
    setUserOptions([]);
    try {
      const result = await getUserOptions()

      if (mounted.current && result) {
        setUserOptions(result.data);
      }
    } catch (err) {
      console.error(err);

    }
  }, [getUserOptions]);

  useEffect(() => {
    getUsersList().catch(console.error);
  }, [getUserOptions]);

  const handleBodyChange = (e) => {
    setEditorState(e)
    setBody(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  const addEmail = useCallback(() => {
    addresses.indexOf(address) === -1 && address !== '' && setAddresses([...addresses, address])
    setAddress('')
  }, [address, addresses, setAddress, setAddresses])

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        addEmail()
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [address, addEmail]);

  const removeEmail = (email) => {
    const filtered = addresses.filter(item => item !== email)
    setAddresses([...filtered])
    setAddress('')
  }

  const getFileBlobs = async (files) => {
    return await Promise.all(files.map(async (file) => {
      return await fetch(file).then(r => r.blob())
    }));
  }

  const sendMail = async () => {
    setWorking(true)
    let formData = new FormData();
    if (attachments) {
      const attachmentBlobs = await getFileBlobs(attachments)
      attachmentBlobs.forEach(attachmentBlob => {
        formData.append("files[]", getFileFromBlob(attachmentBlob))
      })
    }

    formData.append('subject', subject)
    formData.append('body', body)
    addresses.map(address => {
      formData.append('addresses[]', address)
    })

    const result = await sendEmail(formData).finally(() => setWorking(false))
    if (await result.message === 'success') {
      toast.success(t("The email(s) have been sent successfully"))
      setEditorState(EditorState.createEmpty())
      setSubject('')
      setAddresses([])
      setModalVisibility(false)
    }
  }

  const validate = (callback) => {
    let e = {}
    if (addresses.length === 0) {
      e.addresses = 'Please add at least one recipient.'
    } else {
      addresses.forEach(a => {
        if (a.indexOf('@') === -1 || a.indexOf('.') === -1 || a.length < 5) {
          e.addresses = t('One of the addresses is invalid. Please correct.')
        }
      })
    }
    if (Object.keys(e).length === 0) {
      setErrors({})
      callback()
    } else {
      setErrors({...e})
    }
  }

  const emailContextMethods = useMemo(() => ({
    setInitialBody: (body) => {
      setBody(body)
      setEditorStateFromHtml(body)
    },
    showEmailClient: () => {
      setModalVisibility(true)
    }
  }), [])

  return (
    <EmailClientContext.Provider value={[addresses, {
      ...emailContextMethods,
      setAddresses,
      setSubject,
      setTitle,
    }]}>
      <ConfirmationDialog
        message={"You are about to send one or more emails."}
        onCancel={() => setConfirmationDialogVisibility(false)}
        onConfirm={() => {
          sendMail()
          setConfirmationDialogVisibility(false)
        }}
        open={confirmationDialogVisibility}
        title="Are you sure?"
        variant="warning"
      />
      <Dialog
        onClose={() => setModalVisibility(false)}
        open={modalVisibility}
      >
        <DialogTitleTranslated title={'Compose Email'}/>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <Table size={"small"}>
                <TableBody>
                  <TableRow>
                    <TableCell width={50}>
                      Addresses
                    </TableCell>
                    <TableCell>
                      {errors.addresses && addresses.length === 0 ?
                        <Alert severity="error">{errors.addresses}</Alert> : <ul style={{
                          listStyleType: "none",
                          paddingLeft: 0,
                          marginBottom: 10,
                          overflow: "auto"
                        }}>
                          {addresses.map(item => <li key={item} style={{
                            float: "left",
                            borderRadius: 5,
                            padding: 3,
                            color: '#fff',
                            marginRight: 5,
                            fontSize: "0.8em"
                          }}>{item}
                            <IconButton onClick={() => removeEmail(item)} size={"small"}><Delete style={{
                              color: 'red',
                              fontSize: 12
                            }}/></IconButton></li>)}
                        </ul>}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={userOptions}
                        getOptionLabel={(option) => option}
                        size={"small"}
                        fullWidth
                        clearOnEscape={true}
                        autoComplete={true}
                        clearOnBlur={true}
                        inputValue={address}
                        onInputChange={(e, textValue) => setAddress(textValue)}
                        renderInput={(params) => <TextField {...params} fullWidth id="address" type="text"
                                                            placeholder={"Addresses"} label={"Add address"}
                        />
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <TextField fullWidth id="address" type="text" placeholder={"Addresses"} label={"Subject"}
                                 value={subject}
                                 onChange={(e) => setSubject(e.currentTarget.value)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
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
                </TableBody>
              </Table>
              <Uploader title={"Attachments"} multiple={true} data={attachments} setData={setAttachments}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setModalVisibility(false)}
            variant="outlined"
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
        </DialogActions>
      </Dialog>
      {children}
    </EmailClientContext.Provider>
  );
}