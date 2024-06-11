import {
  Dialog, DialogActions,
  DialogContent,
  Grid,
} from "@material-ui/core";
import {InputField} from "../../../components/common/input-fields/input-field";
import {useEffect, useState} from "react";
import TrButton from "../../../components/common/translated/translated-button";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

const RoleDialog = ({roleId = null, setSelectedRoleId, roleName = "", open, onClose, onSubmitted, ...other}) => {
  const [name, setName, ] = useState(roleName)

  const handleSubmit = () => {
    onSubmitted(name)
    onClose()
  }

  const resetForm = () => {
    setName('')
    setSelectedRoleId(null)
  }

  useEffect(() => {
    setName(roleName)
  }, [roleName])

  return (
    <Dialog
      onClose={onClose}
      open={open}
      TransitionProps={{
        onExited: () => resetForm()
      }}
      {...other}
    >
      <TrDialogTitle>
        {roleId ? "Update" : "Add"} Role
      </TrDialogTitle>
      <DialogContent>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <InputField
              fullWidth
              helperText="Add a name"
              label="Name"
              name="name"
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              type={"text"}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <TrButton
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </TrButton>
        <TrButton
          color="primary"
          disabled={name.length < 2}
          onClick={() => {
            handleSubmit(name);
          }}
          variant="contained"
        >
          {roleId ? "Update Role" : "Add Role"}
        </TrButton>
      </DialogActions>
    </Dialog>
  );
}

export default RoleDialog