import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  FormControl,
  Grid, InputLabel, MenuItem, Select,
} from "@material-ui/core";
import {InputField} from "../../../components/common/input-fields/input-field";
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useLanguage} from "../../../hooks/use-language";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

const DiscountRuleProductCategoryAssociationDialog = ({discountRuleId, open, onClose, onSelected, ...other}) => {
  const [options, setOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState([])
  const [selectedProductId, setSelectedProductId] = useState()
  const [filter, setFilter] = useState('')
  const {fetchAvailableProductCategories} = useContext((APIContext))
  const {getLang} = useLanguage()

  const resetForm = () => {
    setFilter('')
    setSelectedProductId(null)
  }

  const getOptions = useCallback(async () => {
    try {
      fetchAvailableProductCategories(discountRuleId).then(response => {
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
        Add Product Category Association
      </TrDialogTitle>
      <DialogContent>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <InputField
              fullWidth
              helperText="Search product category by name"
              label="Search"
              name="search"
              onChange={(e) => setFilter(e.currentTarget.value)}
              value={filter}
              type={"text"}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="product-selector-label">Product Categories</InputLabel>
              <Select
                labelId="product-selector-label"
                id="product-selector"
                value={selectedProductId}
                fullWidth
                label="Product Categories"
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
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={selectedProductId === null}
          onClick={() => {
            handleSubmit(selectedProductId);
          }}
          variant="contained"
        >
          Add Product Category
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiscountRuleProductCategoryAssociationDialog