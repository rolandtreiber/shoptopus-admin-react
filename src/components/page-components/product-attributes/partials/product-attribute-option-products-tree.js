import {Avatar, Box, Link, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {useLanguage} from "../../../../hooks/use-language";
import RightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import NoImg from "../../../../static/images/no-image.png";

const ProductAttributeOptionProductsTree = ({data}) => {
  const {getLang} = useLanguage()

  return (
    <>
      {Object.keys(data).map((key) => {
          const product = data[key]['product']
          const variants = data[key]['variants']

          return (
            <Box key={key}>
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
                  to={"/admin/products/" + key}
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
              {variants.map(variant => (
                <>
                  <Box key={key} sx={{
                    ml: 2,
                  }}>
                    <Box sx={{
                      alignItems: 'top',
                      display: 'flex',
                      mt: 1
                    }}>
                      <RightIcon fontSize={"0.8em"} sx={{
                        mt: 0.5,
                        mr: 1
                      }}/>
                      <Avatar sx={{
                        width: 24,
                        height: 24,
                        mr: 1
                      }} src={variant.cover_image ? variant.cover_image : NoImg} alt="product-variant-cover-photo"/>
                      <Typography
                        color="textSecondary"
                        sx={{
                          color: 'primary.lightText',
                        }}
                        variant="body"
                      >
                        {getLang(variant.name)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ))}
            </Box>
          )
        }
      )}
    </>
  )
}

export default ProductAttributeOptionProductsTree