import React from "react"
import {Box, Card} from "@material-ui/core";

const Panel = ({children, ph = 1, pv = 1}) => {
  return (
    <Card variant="outlined">
      <Box sx={{pt: pv, pb: pv, pl: ph, pr: ph}}>
        {children}
      </Box>
    </Card>
  )
}

export default Panel