import React, {createRef, useContext, useEffect, useState} from 'react'
import {Editor} from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {SettingsContext} from "../../../contexts/settings-context";

const toolbar = {
  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
}

const RichTextEditor = ({initialContent, setContent}) => {
  const editorRef = createRef()
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const {theme} = useContext(SettingsContext)

  const setEditorStateFromHtml = (initialBody) => {
    const content = htmlToDraft(initialBody);
    const contentBlocks = content.contentBlocks;
    const contentEntityMap = content.entityMap;
    const contentState = ContentState.createFromBlockArray(contentBlocks, contentEntityMap);
    const editorStateLocal = EditorState.createWithContent(contentState);
    setEditorState(editorStateLocal)
  }

  useEffect(() => {
    if (initialContent !== '') setEditorStateFromHtml(initialContent)
  }, [initialContent])

  const handleBodyChange = (e) => {
    setEditorState(e)
    setContent(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  return (
    <>
      <Editor
        toolbarClassName={theme === 'dark' ? "wysiwyg-toolbar-dark" : "wysiwyg-toolbar-light"}
        wrapperClassName={theme === 'dark' ? "wysiwyg-toolbar-wrapper-dark" : "wysiwyg-toolbar-wrapper-light"}
        editorClassName={theme === 'dark' ? "wysiwyg-toolbar-editor-dark" : "wysiwyg-toolbar-editor-light"}
        ref={editorRef}
        editorState={editorState}
        toolbar={toolbar}
        onEditorStateChange={(e) => handleBodyChange(e)}
      />
    </>
  )
}

export default RichTextEditor