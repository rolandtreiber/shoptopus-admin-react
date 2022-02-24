import React from "react";
import {Button, Dialog, DialogContent, DialogTitle, Grid} from "@material-ui/core";

export default function GenericDialogModal(props) {
  const {onClose, title} = props;
  const open = props.open;

  const body = (
    <div >
      <div>
        <div>{props.description}</div>
      </div>
      <div>
        <Button onClick={() => props.onProceed()} color="primary" disableElevation variant="contained">Proceed</Button>
        <Button style={{marginLeft:5}} onClick={() => props.onClose()} color="primary" disableElevation variant="contained">Cancel</Button>
      </div>
    </div>
  )

  return (
    <Dialog
      onClose={onClose}
      open={open}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12}>
            {body}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
    // <Modal
    //   open={open}
    //   onClose={props.onClose}
    //   aria-labelledby="simple-modal-title"
    //   aria-describedby="simple-modal-description"
    // >
    //   {body}
    // </Modal>
  )
}
