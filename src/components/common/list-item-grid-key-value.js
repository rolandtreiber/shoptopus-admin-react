import React from "react"
import {Box, Card, Grid, ListItem, ListItemText} from "@material-ui/core";

const ListItemGridKeyValue = ({left, right}) => {
  return (
    <ListItem>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          {left}
        </Grid>
        <Grid item xs={8}>
          {right}
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default ListItemGridKeyValue