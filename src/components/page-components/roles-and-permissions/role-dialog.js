import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import {InputField} from "../../common/input-field";
import {useEffect, useState} from "react";

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
      <DialogTitle>
        {roleId ? "Update" : "Add"} Role
      </DialogTitle>
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
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={name.length < 2}
          onClick={() => {
            handleSubmit(name);
          }}
          variant="contained"
        >
          {roleId ? "Update" : "Add"} Role
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoleDialog