import React, {createContext, useState} from "react";
import GenericDialogModal from "../components/modal/generic-dialog-modal";

export const DialogContext = createContext();

export const DialogProvider = ({children}) => {
  const [callback, setCallback] = useState({method: null})
  const [genericDialogVisibility, showGenericDialog] = useState(false)
  const [title, setTitle] = useState('Are you sure?')
  const [description, setDescription] = useState('Are you sure?')

  return (
    <DialogContext.Provider
      value={[
          {callback},
          {setCallback, showGenericDialog, setTitle, setDescription}
        ]}
    >
      <GenericDialogModal
        onClose={() => showGenericDialog(false)}
        open={genericDialogVisibility}
        title={title}
        description={description}
        onProceed={() => {
          callback.method()
          showGenericDialog(false)
        }}
      />
      {children}
    </DialogContext.Provider>
  )
}