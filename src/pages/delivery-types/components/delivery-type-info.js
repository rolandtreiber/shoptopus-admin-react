import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Chip,
  Divider, Grid,
  List, ListItem, ListItemText,
  Paper,
  useMediaQuery
} from '@material-ui/core';
import TrButton from "../../../components/common/translated/translated-button";
import {useLanguage} from "../../../hooks/use-language";
import Price from "../../../components/common/price";
import {lightNeutral} from "../../../colors";
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import {useTheme} from "@material-ui/core/styles";
import {useSettings} from "../../../contexts/settings-context";
import TrCardHeader from "../../../components/common/translated/translated-card-header";
import {TrTypography} from "../../../components/common/translated/translated-typography";

export const DeliveryTypeInfo = (props) => {
  const {onEdit, onCreateRule, onEditRule, onDeleteRule, data, ...other} = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()
  const theme = useTheme()
  const {settings} = useSettings()
  const maps_api_key = settings && settings.google_maps_api_key

  const align = mdDown ? 'vertical' : 'horizontal';

  return (
    <Grid container spacing={3}>
      <Grid container item lg={12}
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
            <TrCardHeader
              action={(
                <TrButton
                  color="primary"
                  onClick={onEdit}
                  variant="text"
                >
                  Edit
                </TrButton>
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
          </Card>
        </Grid>
      </Grid>

      <Grid container item lg={12}
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
            <TrCardHeader
              title="Rules"
              action={(
                <TrButton
                  color="primary"
                  onClick={onCreateRule}
                  variant="text"
                >
                  Add
                </TrButton>
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
                <TrTypography
                  sx={{
                    color: lightNeutral[500]
                  }}
                  variant="caption"
                >There are no rules to show</TrTypography>
              ) : (
                <Grid container item lg={12}
                      spacing={3}
                      sx={{ height: 'fit-content' }}
                      xs={12}
                >
                  {data.rules.map(r =>
                      <Grid
                        key={r.id}
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        marginTop={2}
                      >
                    <Paper sx={{opacity:r.enabled ? 1 : 0.5, padding: 1}} variant={"outlined"}>
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
                        {r.lat && r.lon && <FullWidthSquareBox style={{
                          borderRadius: theme.shape.borderRadius,
                          backgroundColor: theme.palette.neutral[200],
                          minWidth: 210
                        }}>
                          <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                            <img width={"100%"}
                                 src={"https://maps.googleapis.com/maps/api/staticmap?center=" + r.lat + "," + r.lon + "&size=300x300&zoom=12\n" +
                                   "&key=" + maps_api_key}/>
                          </Box>
                        </FullWidthSquareBox>}
                      </ListItem>
                      {r.postcodes && <ListItem>
                        <ListItemText sx={{flex: 1}}>Postcodes</ListItemText>
                        <ListItemText sx={{flex: 2}}>
                          {r.postcodes.map(p => <Chip key={p} sx={{margin: "2px"}} variant={"outlined"} color="primary" size={"small"} label={p}/>)}
                        </ListItemText>
                      </ListItem>}
                      <ListItem>
                        <ListItemText sx={{flex: 1}}>
                          <TrButton onClick={() => onEditRule(r)}>Edit</TrButton>
                          <TrButton color="error" onClick={() => onDeleteRule(r.id)}>Delete</TrButton></ListItemText>
                      </ListItem>
                    </List>
                  </Paper>
                      </Grid>)}
                </Grid>
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
