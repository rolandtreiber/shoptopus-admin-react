import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  FormControl,
  Grid, InputLabel, MenuItem, Select,
} from "@material-ui/core";
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

const RoleUserAssociationDialog = ({roleId, open, onClose, onSelected, ...other}) => {
  const [options, setOptions] = useState([])
  const [selectedUserId, setSelectedUserId] = useState()
  const {fetchAvailableUsersForRole} = useContext((APIContext))
  
  const resetForm = () => {
    setSelectedUserId(null)
  }
  
  const getOptions = useCallback(async () => {
    try {
      fetchAvailableUsersForRole(roleId).then(response => {
        if (response.status === 200) {
          setOptions(response.data?.data)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [roleId])
  
  useEffect(() => {
    if (open === true) {
      getOptions().catch((e) => {
        console.log(e)
      })
    }
  }, [open])
  
  useEffect(() => {
    setSelectedUserId(null)
  }, [options])
  
  const handleSubmit = () => {
    onSelected(selectedUserId)
    onClose()
  }
  
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
        Assign Role to User
      </TrDialogTitle>
      <DialogContent>
        
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="product-selector-label">Available Users</InputLabel>
              <Select
                labelId="user-selector-label"
                id="user-selector"
                value={selectedUserId}
                fullWidth
                label="Available Users"
                onChange={(e) => {setSelectedUserId(e.target.value)}}
              >
                <MenuItem key={"null"} value={null}>Select a user</MenuItem>
                {options.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
              </Select>
            </FormControl>
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
          disabled={selectedUserId === null}
          onClick={() => {
            handleSubmit(selectedUserId);
          }}
          variant="contained"
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoleUserAssociationDialog