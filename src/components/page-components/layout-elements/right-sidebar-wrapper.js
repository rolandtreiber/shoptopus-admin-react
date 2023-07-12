import {Box, Card, CardContent, CardHeader, Divider} from "@material-ui/core";

const RightSidebarWrapper = ({styles, title, children}) => (
    <Card
      variant="outlined"
      {...styles}
    >
      <CardHeader
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