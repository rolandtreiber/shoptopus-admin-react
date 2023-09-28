import {Avatar, Box, Link, Typography} from "@material-ui/core";
import {useLanguage} from "../../../../hooks/use-language";
import RightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import NoImg from "../../../../static/images/no-image.png";
import {Link as RouterLink} from "react-router-dom";

const ProductCategoryTreeItem = ({category, topLevel}) => {
  const {getLang} = useLanguage()

  return (
    <Box sx={{
      ml: 2,
    }}>
      <Box sx={{
        alignItems: 'top',
        display: 'flex',
        mt: 1
      }}>
        {!topLevel && <RightIcon fontSize={"0.8em"} sx={{
          mt: 0.5,
          mr: 1
        }}/>}
        <Avatar sx={{
          width: 24,
          height: 24,
          mr: 1
        }} src={category.menu_image ? category.menu_image : NoImg} alt="sub-category-image"/>
        <Link
          color="inherit"
          component={RouterLink}
          sx={{display: 'block'}}
          to={"/admin/product-categories/" + category.id}
          underline="none"
          variant="subtitle2"
        >
          <Typography
            color="textSecondary"
            sx={{
              color: 'primary.lightText',
              opacity: category.enabled ? 1 : 0.5
            }}
            variant="body"
          >
            {getLang(category.name)}
          </Typography>
        </Link>
      </Box>
      {!topLevel && category.children.map((c) => (
          <ProductCategoryTreeItem key={c.id} category={c} topLevel={false}/>
      ))}
    </Box>
  )
}

export default ProductCategoryTreeItem