import {Avatar, Box, Link, Typography} from "@material-ui/core";
import NoImg from "../../../static/images/no-image.png";
import {Link as RouterLink} from "react-router-dom";
import {useLanguage} from "../../../hooks/use-language";

const ProductTagProductListItem = ({product}) => {
  const {getLang} = useLanguage()

  return (
      <Box>
      <Box sx={{
        alignItems: 'top',
        display: 'flex',
        mt: 1
      }}>
        <Avatar sx={{
          width: 24,
          height: 24,
          mr: 1
        }} src={product.cover_photo_url ? product.cover_photo_url : NoImg} alt="product-cover-photo"/>
        <Link
          color="inherit"
          component={RouterLink}
          sx={{display: 'block'}}
          to={"/admin/products/" + product.id}
          underline="none"
          variant="subtitle2"
        >
          <Typography
            color="textSecondary"
            sx={{
              color: 'primary.lightText',
            }}
            variant="body"
          >
            {getLang(product.name)}
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}

export default ProductTagProductListItem