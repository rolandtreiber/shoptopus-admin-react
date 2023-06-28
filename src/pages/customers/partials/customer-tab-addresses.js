import React, {useState} from "react"
import {Box, Card, Grid, Link, List, ListItemText} from "@material-ui/core";
import FullWidthSquareBox from "../../../components/common/full-width-square-box";
import IconButton from "@material-ui/core/IconButton";
import {Map as MapIcon} from "@material-ui/icons";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {useTheme} from "@material-ui/core/styles";
import {useLanguage} from "../../../hooks/use-language";
import Map from "../../../components/maps/map";

const CustomerTabAddresses = ({data}) => {
  const theme = useTheme()
  const {getLang} = useLanguage()

  return (
    <Grid container spacing={2}>
      {data.length > 0 ? data.map(address => (
          <Grid item xs={12} lg={6}>
            <Card variant="outlined">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FullWidthSquareBox style={{
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.neutral[200],
                    minWidth: 210
                  }}>
                    <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                      <Map markers={[]}
                           style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                           mapStyles={{}}
                           locationUpdated={() => {}}
                           placeId={null}
                           location={{
                             lat: parseFloat(address.lat),
                             lng: parseFloat(address.lon),
                           }}
                           height={"100%"}
                           clearAutocomplete={() => {}}
                      />
                    </Box>
                  </FullWidthSquareBox>
                </Grid>
                <Grid item xs={6} sx={{position: "relative"}}>
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
                  <Link href={address.composite} target={"_blank"}><IconButton sx={{position: "absolute", bottom: 10, right: 10}}><MapIcon/></IconButton></Link>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No orders to display
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default CustomerTabAddresses