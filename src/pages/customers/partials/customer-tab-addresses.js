import React from "react"
import {Card, Grid} from "@material-ui/core";
import AddressCard from "../../../components/page-components/addresses/address-card";

const CustomerTabAddresses = ({data}) => {

  return (
    <Grid container spacing={2}>
      {data.length > 0 ? data.map(address => (
        <Grid key={address.id} item xs={12} lg={6}>
          <AddressCard address={address}/>
        </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No addresses to display
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default CustomerTabAddresses