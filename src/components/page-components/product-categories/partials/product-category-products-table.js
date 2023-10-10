import {useLanguage} from "../../../../hooks/use-language";
import {Scrollbar} from "../../../common/scrollbar";
import {Avatar, Box, Link, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {useTranslation} from "react-i18next";

const columns = [
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'price',
    label: 'Price'
  },
  {
    id: 'final_price',
    label: 'Final Price'
  }
];
const ProductCategoryProductsTable = ({data}) => {
  const {getLang} = useLanguage()
  const { t } = useTranslation();

  return (
    <Scrollbar>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                {t(column.label)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(p => (
            <TableRow key={p.id}>
              <TableCell>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Avatar
                    alt={getLang(p.name)}
                    src={p.cover_photo_url}
                    sx={{
                      width: 64,
                      height: 64
                    }}
                    variant="rounded"
                  />
                  <Box sx={{ ml: 2 }}>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      sx={{ display: 'block' }}
                      to={"/admin/products/"+p.product_id}
                      underline="none"
                      variant="subtitle2"
                    >
                      {getLang(p.name)}
                    </Link>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.final_price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  )

}

export default ProductCategoryProductsTable