import {useParams} from "react-router-dom";
import {Grid} from "@material-ui/core";

export const ProductPreview = ({slug}) => {
  const {productId} = useParams();
  const storefrontUrl = process.env.REACT_APP_STOREFRONT_URL;

  return <div>
    <Grid container spacing={3}>
      <Grid
        item
        md={12}
        xs={12}
      >
        <iframe width={"100%"} height={"800px"} src={storefrontUrl+"/product/"+productId+"?preview=1"}></iframe>
      </Grid>
    </Grid>
  </div>
}