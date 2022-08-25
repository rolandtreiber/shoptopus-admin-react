import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardHeader, Chip,
  Box,
  Divider, Grid,
  List, ListItem, ListItemText,
  Typography,
  useMediaQuery, Paper
} from '@material-ui/core';
import {useLanguage} from "../../hooks/use-language";
import Price from "../price";
import React from "react";
import {lightNeutral} from "../../colors";

export const DeliveryTypeInfo = (props) => {
  const {onEdit, data, ...other} = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  return (
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
            {...other}
          >
            <CardHeader
              action={(
                <Button
                  color="primary"
                  onClick={onEdit}
                  variant="text"
                >
                  Edit
                </Button>
              )}
              title="Details"
            />
            <Divider/>
            <List>
              <ListItem>
                <Chip sx={{fontSize: 34, padding: 4}} label={getLang(data.name)} color="primary"/>
              </ListItem>
              <ListItem>
                <ListItemText sx={{"flex": "1"}}>Description</ListItemText>
                <ListItemText sx={{"flex": "3"}}>{getLang(data.description)}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText sx={{"flex": "1"}}>Status</ListItemText>
                <ListItemText sx={{"flex": "3"}}>{data.enabled ? 'Enabled' : 'Disabled'}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText sx={{"flex": "1"}}>Price</ListItemText>
                <ListItemText sx={{"flex": "3"}}><Price>{data.price}</Price></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText sx={{"flex": "1"}}>Orders count</ListItemText>
                <ListItemText sx={{"flex": "3"}}>{data.order_count}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText sx={{"flex": "1"}}>Total revenue</ListItemText>
                <ListItemText sx={{"flex": "3"}}><Price>{data.total_revenue}</Price></ListItemText>
              </ListItem>
            </List>
            {/*<PropertyList>*/}
            {/*  <PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label="Name"*/}
            {/*    value={getLang(data.name)}*/}
            {/*  />*/}
            {/*  <PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label="Description"*/}
            {/*    value={getLang(data.description)}*/}
            {/*  />*/}
            {/*  <PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label="Status"*/}
            {/*    value={data.enabled ? 'Enabled' : 'Disabled'}*/}
            {/*  />*/}
            {/*  <PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label="Price"*/}
            {/*  >*/}
            {/*    <Price>{data.price}</Price>*/}
            {/*  </PropertyListItem>*/}
            {/*  <PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label="Rules"*/}
            {/*  >*/}
            {/*    <Rule variant={"outlined"} >*/}
            {/*      <List dense>*/}
            {/*        {data.rules.map(rule =>*/}
            {/*          (*/}
            {/*            <ListItem key={rule.id} divider>*/}
            {/*              <ListItemText primary={rule.id} />*/}
            {/*            </ListItem>*/}
            {/*          )*/}
            {/*        )}*/}
            {/*      </List>*/}
            {/*    </Rule>*/}
            {/*  </PropertyListItem>*/}
            {/*</PropertyList>*/}
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
              title="Rules"
              action={(
                <Button
                  color="primary"
                  onClick={onEdit}
                  variant="text"
                >
                  Add
                </Button>
              )}
            />
            <Divider />
            <Box
              sx={{
                px: 3,
                py: 1.5
              }}
            >
              {data.rules.length === 0 ? (
                <Typography
                  sx={{
                    color: lightNeutral[500]
                  }}
                  variant="caption"
                >There are no rules to show</Typography>
              ) : (
                <>
                  {data.rules.map(r => <Paper sx={{padding: 1}} variant={"outlined"}>
                    <List>
                      <ListItem>
                        <ListItemText sx={{flex: 1}}>Weight</ListItemText>
                        <ListItemText sx={{flex: 2}}>Min: {r.min_weight ? r.min_weight+" g" : "Any"} - Max: {r.max_weight ? r.max_weight+" g" : "Any"}</ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText sx={{flex: 1}}>Distance</ListItemText>
                        <ListItemText sx={{flex: 2}}>Min: {r.min_distance ? r.min_distance+r+" "+r.distance_unit+"s" : "Any"} - Max: {r.max_distance ? r.max_distance+" "+r.distance_unit+"s" : "Any"}</ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText sx={{flex: 1}}>Postcodes</ListItemText>
                        <ListItemText sx={{flex: 2}}>
                          {r.postcodes.map(p => <Chip sx={{margin: "2px"}} variant={"outlined"} color="primary" size={"small"} label={p}/>)}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Paper>)}
                </>
                )
              }
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Grid>
  );
};

DeliveryTypeInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
