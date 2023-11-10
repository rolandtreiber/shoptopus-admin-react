import {Box, Card, CardContent, Divider} from "@material-ui/core";
import TrCardHeader from "../../translated/TrCardHeader";

const RightSidebarWrapper = ({styles, title, children}) => (
    <Card
      variant="outlined"
      {...styles}
    >
      <TrCardHeader
        title={title}
        variant="outlined"
      />
      <Divider/>
      <CardContent>
        <Box
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {children}
        </Box>
      </CardContent>
    </Card>
  )

export default RightSidebarWrapper