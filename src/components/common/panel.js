import {Box, Card} from "@material-ui/core";

const Panel = ({children, ph = 1, pv = 1, pt = null, pb = null, pr = null, pl = null}) => {
  return (
    <Card variant="outlined">
      <Box sx={{pt: !pt ? pv : pt,
                pb: !pb ? pv : pb,
                pl: !pl ? ph : pl,
                pr: !pr ? ph : pr}}>
        {children}
      </Box>
    </Card>
  )
}

export default Panel