import React from "react"
import {
  Avatar,
  Box,
  Card,
  Grid, Link,
  List,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Typography
} from "@material-ui/core";
import {Scrollbar} from "../../../components/common/scrollbar";
import {useLanguage} from "../../../hooks/use-language";
import Price from "../../../components/common/price";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {format} from "date-fns";
import {Link as RouterLink} from "react-router-dom";
import NoImg from "../../../static/images/no-image.png";

const CustomerTabCart = ({data}) => {
  const {getLang} = useLanguage()

  return (<Grid container spacing={2}>
      {data.products.length > 0 ? <>
        <Grid item xs={12} lg={6}>
          <List>
            <ListItemGridKeyValue
              left={<ListItemText>Last Updated</ListItemText>}
              right={<ListItemText>{format(new Date(data.last_updated), 'dd-MMM-yyyy HH:mm')}</ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Products Total</ListItemText>}
              right={<ListItemText>{data.products_total}</ListItemText>}
            />
          </List>
          </Grid>
        <Grid item xs={12} lg={6}>
          <List>
            <ListItemGridKeyValue
              left={<ListItemText>Price Payable</ListItemText>}
              right={<ListItemText><Price>{data.price}</Price></ListItemText>}
            />
            <ListItemGridKeyValue
              left={<ListItemText>Full Price (without discounts)</ListItemText>}
              right={<ListItemText><Price>{data.full_price}</Price></ListItemText>}
            />
          </List>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Box
            sx={{
              display: 'flex', flex: 1, flexDirection: 'column'
            }}
          >
            <Scrollbar>
              <Table sx={{minWidth: 1000}}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="normal">Name</TableCell>
                    <TableCell padding="normal">Quantity</TableCell>
                    <TableCell padding="normal">Unit price</TableCell>
                    <TableCell padding="normal">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.products.map(product => (<TableRow key={product.id}>
                      <TableCell
                        padding="normal">
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex'
                          }}
                        >
                          <Avatar
                            alt={getLang(product.name)}
                            src={product.cover_photo_url ? product.cover_photo_url : NoImg}
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
                              to={"/products/"+product.id}
                              underline="none"
                              variant="subtitle2"
                            >
                              {getLang(product.name)}
                            </Link>
                            <Typography
                              color="textSecondary"
                              sx={{ mt: 1 }}
                              variant="body2"
                            >
                              {product.variant ? getLang(product.variant.name) : getLang(product.name)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell padding="normal">{product.quantity}</TableCell>
                      <TableCell padding="normal"><Price>{product.item_final_price}</Price></TableCell>
                      <TableCell padding="normal"><Price>{product.price}</Price></TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Grid>
      </> : (<Grid item xs={12}>
          <Card variant="outlined" style={{padding: 10}}>
            No products to display
          </Card>
        </Grid>)}
    </Grid>)
}

export default CustomerTabCart