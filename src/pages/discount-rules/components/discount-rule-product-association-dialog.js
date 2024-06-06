import {
  Dialog, DialogActions,
  DialogContent,
  FormControl,
  Grid, InputLabel, MenuItem, Select,
} from "@material-ui/core";
import {InputField} from "../../../components/common/input-fields/input-field";
import {useCallback, useContext, useEffect, useState} from "react";
import TrButton from "../../../components/common/translated/translated-button";
import {APIContext} from "../../../contexts/api-context";
import {useLanguage} from "../../../hooks/use-language";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

const DiscountRuleProductAssociationDialog = ({discountRuleId, open, onClose, onSelected, ...other}) => {
  const [options, setOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState([])
  const [selectedProductId, setSelectedProductId] = useState()
  const [filter, setFilter] = useState('')
  const {fetchAvailableProducts} = useContext((APIContext))
  const {getLang} = useLanguage()

  const resetForm = () => {
    setFilter('')
    setSelectedProductId(null)
  }

  const getOptions = useCallback(async () => {
      try {
        fetchAvailableProducts(discountRuleId).then(response => {
          if (response.status === 200) {
            setOptions(response.data?.data)
          }
        })
      } catch (err) {
        console.log(err)
      }
  }, [discountRuleId])

  useEffect(() => {
    if (open === true) {
      getOptions().catch((e) => {
        console.log(e)
      })
    }
  }, [open])

  useEffect(() => {
    setSelectedProductId(null)
    setFilteredOptions(options.filter(o => {return getLang(o.name).indexOf(filter) !== -1}))
  }, [options, filter])

  const handleSubmit = () => {
    onSelected(selectedProductId)
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
        Add Product Association
      </TrDialogTitle>
      <DialogContent>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <InputField
              fullWidth
              helperText="Search product by name"
              label="Search"
              name="search"
              onChange={(e) => setFilter(e.currentTarget.value)}
              value={filter}
              type={"text"}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="product-selector-label">Product</InputLabel>
            <Select
              labelId="product-selector-label"
              id="product-selector"
              value={selectedProductId}
              fullWidth
              label="Products"
              onChange={(e) => {setSelectedProductId(e.target.value)}}
            >
              <MenuItem key={"null"} value={null}>Select a product</MenuItem>
              {filteredOptions.map(o => <MenuItem key={o.id} value={o.id}>{getLang(o.name)}</MenuItem>)}
            </Select>
            </FormControl>
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
          disabled={selectedProductId === null}
          onClick={() => {
            handleSubmit(selectedProductId);
          }}
          variant="contained"
        >
          Add Product
        </TrButton>
      </DialogActions>
    </Dialog>
  );
}

export default DiscountRuleProductAssociationDialog