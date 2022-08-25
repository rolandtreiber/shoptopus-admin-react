import React, {useContext} from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  Chip,
  Typography,
  Accordion, AccordionSummary, AccordionDetails, ListItemText
} from "@material-ui/core";
import {PropertyListItem} from "../property-list-item";
import productStatuses from "../../data/product-statuses.json"
import {format} from "date-fns";
import {lightNeutral} from "../../colors";
import {ExpandMore, Visibility} from "@material-ui/icons";
import {PropertyList} from "../property-list";
import {Link as RouterLink} from "react-router-dom";
import {SettingsContext} from "../../contexts/settings-context";
import Price from "../price";

const DiscountRuleDetails = ({discountRule}) => {
  const {language} = useContext(SettingsContext)

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item lg={8}
              spacing={3}
              sx={{ height: 'fit-content' }}
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
              <CardHeader
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
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 1.5
                }}
              >
                <List>
                  <ListItem>
                    <Chip sx={{fontSize: 34, padding: 4}} label={discountRule.name[language]} color="primary" />
                  </ListItem>
                  <PropertyListItem label="Rule" value={discountRule.amount+" off"}/>
                  <PropertyListItem label="Valid" value={format(new Date(discountRule.valid_from), 'dd MMM yyyy HH:mm')+" - "+format(new Date(discountRule.valid_until), 'dd MMM yyyy HH:mm')}/>
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Grid container item lg={4}
              spacing={3}
              sx={{ height: 'fit-content' }}
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
              <CardHeader
                title="Associations"
              />
              <Divider />
                  <Typography
                    sx={{
                      color: lightNeutral[500],
                      margin: 3
                    }}
                    variant="h5"
                  >Product Categories</Typography>
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
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                        >
                          {c.menu_image && <img style={{"width":"20px", "height": "20px", "aspectRatio": "1", "marginRight": 8}} src={c.menu_image}/>}
                              <Typography>
                                {c.name[language]}
                              </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                          <List>
                            {c.header_image && <ListItem>
                              <img style={{"width":"100%"}} src={c.header_image}/>
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
                                startIcon={<Visibility />}
                                to={"/product-categories/"+c.id}
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
                    margin: 3
                  }}
                  variant="h5"
                >Products</Typography>
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
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                        >
                          {p.cover_photo_url && <img style={{"width":"20px", "height": "20px", "aspectRatio": "1", "marginRight": 8}} src={p.cover_photo_url}/>}
                          <Typography>
                            {p.name[language]}
                          </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                          <PropertyList>
                            {p.cover_photo_url && <ListItem>
                              <img style={{"width":"100%"}} src={p.cover_photo_url}/>
                            </ListItem>}
                            <ListItem>
                              <Chip label={productStatuses.find(s => s.value === p.status).label}
                                    sx={{
                                      backgroundColor: productStatuses.find(s => s.value === p.status).color
                                    }}/>
                              <Button
                                color="primary"
                                component={RouterLink}
                                startIcon={<Visibility />}
                                to={"/products/"+p.id}
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
      </Grid>
    </>
  )
}

export default DiscountRuleDetails