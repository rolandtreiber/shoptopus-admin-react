import React from "react";
import {useTheme} from "@material-ui/core/styles";
import {useLanguage} from "../../../hooks/use-language";
import {useSettings} from "../../../contexts/settings-context";
import {Box, Card, Grid, Link, List, ListItemText} from "@material-ui/core";
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import IconButton from "@material-ui/core/IconButton";
import {Map as MapIcon} from "@material-ui/icons";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";

const AddressCard = ({address, vertical = false}) => {
  const theme = useTheme()
  const {getLang} = useLanguage()
  const {settings} = useSettings()
  const maps_api_key = settings && settings.google_maps_api_key

  return (
    <Card variant="outlined">
      <Grid container spacing={2}>
        <Grid item xs={vertical ? 12 : 6}>
          <FullWidthSquareBox style={{
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.neutral[200],
            minWidth: 210
          }}>
            <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
              <img width={"100%"}
                   src={"https://maps.googleapis.com/maps/api/staticmap?center=" + address.lat + "," + address.lon + "&size=300x300&zoom=12\n" +
                     "&key=" + maps_api_key}/>
            </Box>
          </FullWidthSquareBox>
        </Grid>
        <Grid item xs={vertical ? 12 : 6} sx={{position: "relative"}}>
          <List>
            <ListItemGridKeyValue
              left={
                <ListItemText>Name</ListItemText>
              }
              right={
                <ListItemText>{address.name}</ListItemText>
              }
            />
            <ListItemGridKeyValue
              left={
                <ListItemText>Line 1</ListItemText>
              }
              right={
                <ListItemText>{address.address_line_1}</ListItemText>
              }
            />
            <ListItemGridKeyValue
              left={
                <ListItemText>Line 2</ListItemText>
              }
              right={
                <ListItemText>{address.address_line_2}</ListItemText>
              }
            />
            <ListItemGridKeyValue
              left={
                <ListItemText>Town</ListItemText>
              }
              right={
                <ListItemText>{address.town}</ListItemText>
              }
            />
            <ListItemGridKeyValue
              left={
                <ListItemText>Postcode</ListItemText>
              }
              right={
                <ListItemText>{address.post_code}</ListItemText>
              }
            />
          </List>
          <Link href={address.composite} target={"_blank"}><IconButton
            sx={{position: "absolute", bottom: 10, right: 10}}><MapIcon/></IconButton></Link>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AddressCard