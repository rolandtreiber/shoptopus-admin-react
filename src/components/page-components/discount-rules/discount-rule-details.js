import {useCallback, useContext, useState} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  List, ListItem, ListItemText, Typography
} from "@material-ui/core";
import {PropertyListItem} from "../../common/property-list/property-list-item";
import productStatuses from "../../../data/product-statuses.json"
import {format} from "date-fns";
import {lightNeutral} from "../../../colors";
import {Add, ExpandMore, Visibility} from "@material-ui/icons";
import {PropertyList} from "../../common/property-list/property-list";
import {Link as RouterLink} from "react-router-dom";
import {SettingsContext} from "../../../contexts/settings-context";
import Price from "../../common/price";
import {Trash} from "../../../icons/trash";
import {DialogContext} from "../../../contexts/dialog-context";
import {usePopover} from "../../../hooks/use-popover";
import {APIContext} from "../../../contexts/api-context";
import DiscountRuleProductAssociationDialog from "./discount-rule-product-association-dialog";
import DiscountRuleProductCategoryAssociationDialog from "./discount-rule-product-category-association-dialog";
import TrCardHeader from "../../translated/TrCardHeader";

const DiscountRuleDetails = ({discountRule, onUpdated}) => {
  const {language} = useContext(SettingsContext)
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const [showProductAssociationsDialog, setShowProductAssociationsDialog] = useState(false)
  const [showProductCategoryAssociationsDialog, setShowProductCategoryAssociationsDialog] = useState(false)

  const {
    removeProductAssociation,
    removeProductCategoryAssociation,
    addProductCategoryAssociation,
    addProductAssociation,
  } = useContext(APIContext)

  const doRemoveProductAssociation = useCallback(async (id) => {
    try {
      return await removeProductAssociation(discountRule.id, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const doRemoveProductCategoryAssociation = useCallback(async (id) => {
    try {
      return await removeProductCategoryAssociation(discountRule.id, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const doAddProductAssociation = useCallback(async (id) => {
    try {
      return await addProductAssociation(discountRule.id, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const doAddProductCategoryAssociation = useCallback(async (id) => {
    try {
      return await addProductCategoryAssociation(discountRule.id, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDeleteProductAssociation = useCallback(async (id) => {
    const call = () => doRemoveProductAssociation(id).then(result => {
      if (result?.status === 200) {
        handleClose()
        onUpdated(result.data.data)
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a product association.')
    showGenericDialog(true)
  }, [])

  const handleDeleteProductCategoryAssociation = useCallback(async (id) => {
    const call = () => doRemoveProductCategoryAssociation(id).then(result => {
      if (result?.status === 200) {
        handleClose()
        onUpdated(result.data.data)
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a product category association.')
    showGenericDialog(true)
  }, [])

  const handleAddProductCategoryAssociation = useCallback(async (id) => {
    doAddProductCategoryAssociation(id).then(response => {
      if (response?.status === 200) {
        handleClose()
        onUpdated(response.data.data)
      }
    })
  }, [])

  const handleAddProductAssociation = useCallback(async (id) => {
    doAddProductAssociation(id).then(response => {
      if (response?.status === 200) {
        handleClose()
        onUpdated(response.data.data)
      }
    })
  }, [])


  return (
    <>
      <Grid container spacing={3}>
        <Grid container item lg={8}
              spacing={3}
              sx={{height: 'fit-content'}}
              xs={12}
        >
          <Grid
            item
            xs={12}
            marginTop={2}
          >
            <Card
              variant="outlined"
            >
              <TrCardHeader
                action={(
                  <Button
                    color="primary"
                    onClick={() => console.log('edit')}
                    variant="text"
                  >
                    Edit
                  </Button>
                )}
                title="Details"
              />
              <Divider/>
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                <List>
                  <ListItem>
                    <Chip sx={{fontSize: 34, padding: 4}} label={discountRule.name[language]} color="primary"/>
                  </ListItem>
                  <PropertyListItem label="Rule" value={discountRule.amount + " off"}/>
                  <PropertyListItem label="Valid"
                                    value={format(new Date(discountRule.valid_from), 'dd MMM yyyy HH:mm') + " - " + format(new Date(discountRule.valid_until), 'dd MMM yyyy HH:mm')}/>
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Grid container item lg={4}
              spacing={3}
              sx={{height: 'fit-content'}}
              xs={12}
        >
          <Grid
            item
            xs={12}
            marginTop={2}
          >
            <Card
              variant="outlined"
            >
              <TrCardHeader
                title="Associations"
              />
              <Divider/>
              <Typography
                sx={{
                  color: lightNeutral[500],
                  margin: 3,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
                variant="h5"
              >Product Categories
                <Button
                  color="primary"
                  startIcon={<Add/>}
                  variant="contained"
                  size={"small"}
                  onClick={() => setShowProductCategoryAssociationsDialog(true)}
                  sx={{
                    alignSelf: "right",
                    marginLeft: 1
                  }}
                >
                  Add
                </Button>
              </Typography>
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                {discountRule.categories.length === 0 ? (
                  <Typography
                    sx={{
                      color: lightNeutral[500]
                    }}
                    variant="caption"
                  >There are no categories to show</Typography>
                ) : (
                  <>
                    {discountRule.categories.map(c => <Accordion key={c.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMore/>}
                          aria-controls="panel1a-content"
                        >
                          {c.menu_image &&
                            <img style={{"width": "20px", "height": "20px", "aspectRatio": "1", "marginRight": 8}}
                                 src={c.menu_image}/>}
                          <Typography>
                            {c.name[language]}
                          </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                          <Button
                            color="error"
                            startIcon={<Trash/>}
                            variant="contained"
                            size={"small"}
                            onClick={() => handleDeleteProductCategoryAssociation(c.id).catch(e => console.log(e))}
                            sx={{
                              marginLeft: 1
                            }}
                          >
                            Remove
                          </Button>
                          <List>
                            {c.header_image && <ListItem>
                              <img style={{"width": "100%"}} src={c.header_image}/>
                            </ListItem>}
                            <ListItem>
                              <Typography>
                                {c.description[language]}
                              </Typography>
                            </ListItem>
                            <ListItem>
                              <Button
                                color="primary"
                                component={RouterLink}
                                startIcon={<Visibility/>}
                                to={"/admin/product-categories/" + c.id}
                                variant="contained"
                                size={"small"}
                                sx={{
                                  marginLeft: 1
                                }}
                              >
                                View
                              </Button>
                            </ListItem>
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </>
                )}
              </Box>

              <Typography
                sx={{
                  color: lightNeutral[500],
                  margin: 3,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
                variant="h5"
              >Products
                <Button
                  color="primary"
                  startIcon={<Add/>}
                  variant="contained"
                  size={"small"}
                  onClick={() => setShowProductAssociationsDialog(true)}
                  sx={{
                    alignSelf: "right",
                    marginLeft: 1
                  }}
                >
                  Add
                </Button>
              </Typography>
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                {discountRule.products.length === 0 ? (
                  <Typography
                    sx={{
                      color: lightNeutral[500]
                    }}
                    variant="caption"
                  >There are no categories to show</Typography>
                ) : (
                  <>
                    {discountRule.products.map(p => <Accordion key={p.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMore/>}
                          aria-controls="panel1a-content"
                        >
                          {p.cover_photo_url &&
                            <img style={{"width": "20px", "height": "20px", "aspectRatio": "1", "marginRight": 8}}
                                 src={p.cover_photo_url}/>}
                          <Typography>
                            {p.name[language]}
                          </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                          <Button
                            color="error"
                            startIcon={<Trash/>}
                            variant="contained"
                            size={"small"}
                            onClick={() => handleDeleteProductAssociation(p.id).catch(e => console.log(e))}
                            sx={{
                              marginLeft: 1
                            }}
                          >
                            Remove
                          </Button>
                          <PropertyList>
                            {p.cover_photo_url && <ListItem>
                              <img style={{"width": "100%"}} src={p.cover_photo_url}/>
                            </ListItem>}
                            <ListItem>
                              <Chip label={productStatuses.find(s => s.value === p.status).label}
                                    sx={{
                                      backgroundColor: productStatuses.find(s => s.value === p.status).color
                                    }}/>
                              <Button
                                color="primary"
                                component={RouterLink}
                                startIcon={<Visibility/>}
                                to={"/admin/products/" + p.id}
                                variant="contained"
                                size={"small"}
                                sx={{
                                  marginLeft: 1
                                }}
                              >
                                View
                              </Button>
                            </ListItem>
                            <ListItem>
                              <ListItemText>Stock</ListItemText>
                              <ListItemText>{p.stock}</ListItemText>
                            </ListItem>
                            <ListItem>
                              <ListItemText>Price</ListItemText>
                              <ListItemText><Price>{p.price}</Price></ListItemText>
                            </ListItem>
                          </PropertyList>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
        <DiscountRuleProductAssociationDialog open={showProductAssociationsDialog} discountRuleId={discountRule.id} onClose={() => setShowProductAssociationsDialog(false)}
                                              onSelected={(selectedProductId) => handleAddProductAssociation(selectedProductId)}/>
        <DiscountRuleProductCategoryAssociationDialog open={showProductCategoryAssociationsDialog} discountRuleId={discountRule.id} onClose={() => setShowProductCategoryAssociationsDialog(false)}
                                              onSelected={(selectedProductCategoryId) => handleAddProductCategoryAssociation(selectedProductCategoryId)}/>
      </Grid>
    </>
  )
}

export default DiscountRuleDetails