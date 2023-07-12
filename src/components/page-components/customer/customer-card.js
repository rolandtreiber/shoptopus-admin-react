import {Box, Card, Grid, List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import FullSpaceAvatar from "../../common/full-space-avatar";
import {Email, Phone} from "@material-ui/icons";

const CustomerCard = ({data}) => {
  return (
    <Card variant="outlined">
      <Box sx={{p: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FullSpaceAvatar src={data.avatar?.url}>{data.initials}</FullSpaceAvatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <List>
              <ListItem>
                <ListItemIcon><Email/></ListItemIcon>
                <ListItemText>
                  <Typography>{data.email}</Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon><Phone/></ListItemIcon>
                <ListItemText>
                  <Typography>{data.phone ? data.phone : "N/A"}</Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default CustomerCard
