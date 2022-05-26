import React from "react";
import {Card, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Home, LocationCity, LocationOn, Map, Public} from "@material-ui/icons";

const AddressCard = ({address}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
      <List>
        <ListItem>
          <ListItemIcon><Home/></ListItemIcon>
          <ListItemText>{address.address_line_1}</ListItemText>
        </ListItem>
        {address.address_line_2 && <ListItem>
          <ListItemText>{address.address_line_2}</ListItemText>
        </ListItem>}
        <ListItem>
          <ListItemIcon><LocationCity/></ListItemIcon>
          <ListItemText>{address.town}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon><Map/></ListItemIcon>
          <ListItemText>{address.post_code}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon><Public/></ListItemIcon>
          <ListItemText>{address.country}</ListItemText>
        </ListItem>
        {address.composite && <ListItem>
          <ListItemIcon><LocationOn/></ListItemIcon>
          <ListItemText><a href={address.composite} target={"_blank"}>Show on map</a></ListItemText>
        </ListItem>}
      </List>
    </Card>
  )
}

export default AddressCard