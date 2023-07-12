import { Card, Grid, Link, List, ListItemText} from "@material-ui/core";
import {Star as StarIcon} from "../../../icons/star";
import {format} from "date-fns";
import IconButton from "@material-ui/core/IconButton";
import {NorthEast} from "@material-ui/icons";

const CustomerTabRatings = ({data}) => {
  const getStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars = [...stars, (<StarIcon key={'star-' + i} style={{'color': '#cebf17'}}/>)]
    }
    return stars
  }

  return (<Grid container spacing={2}>
      {data.length > 0 ? data.map(rating => (<Grid key={rating.id} item xs={12} lg={6}>
          <Card variant="outlined" sx={{padding: 1, position: "relative"}}>
            <Grid item xs={12}>
              <List>
                <ListItemText>{getStars(rating.rating)}</ListItemText>
                <ListItemText>{rating.description}</ListItemText>
                <ListItemText>{format(new Date(rating.left_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>
              </List>
            </Grid>
            <Link href={'/ratings/' + rating.id} target={"_blank"}><IconButton
              sx={{position: "absolute", bottom: 10, right: 10}}><NorthEast/></IconButton></Link>
          </Card>
        </Grid>)) : (<Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No orders to display
          </Card>
        </Grid>)}
    </Grid>)
}

export default CustomerTabRatings