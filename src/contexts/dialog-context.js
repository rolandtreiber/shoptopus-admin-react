import {createContext, useState} from "react";
import {ConfirmationDialog} from "../components/modal/confirmation-dialog";

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
      <ConfirmationDialog
        message={description}
        onCancel={() => showGenericDialog(false)}
        onConfirm={() => {
          callback.method()
          showGenericDialog(false)
        }}
        open={genericDialogVisibility}
        title={title}
        variant="warning"
      />
      {children}
    </DialogContext.Provider>
  )
}