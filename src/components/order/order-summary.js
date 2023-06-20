import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Scrollbar } from '../common/scrollbar';
import {useLanguage} from "../../hooks/use-language";
import Price from "../common/price";
import {darkWarning} from "../../colors";

export const OrderSummary = (props) => {
  const { order, ...other } = props;
  const {getLang} = useLanguage()

  return (
    <Scrollbar>
      <Table
        sx={{ minWidth: 500 }}
        {...other}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Unit Price
            </TableCell>
            <TableCell>
              Qty
            </TableCell>
            <TableCell>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.products.map((lineItem) => (
            <TableRow key={lineItem.sku}>
              <TableCell>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Avatar
                    src={lineItem.cover_photo_url}
                    sx={{
                      height: 48,
                      mr: 2,
                      width: 48
                    }}
                    variant="rounded"
                  />
                  <div>
                    <Typography
                      color="textPrimary"
                      variant="body2"
                    >
                      {getLang(lineItem.name)}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {`SKU: ${lineItem.sku}`}
                    </Typography>
                  </div>
                </Box>
              </TableCell>
              <TableCell>
                <Price>{lineItem.unit_price}</Price>
                {lineItem.unit_discount > 0 && (<> (<Price>{lineItem.original_unit_price}</Price><Price negative color={darkWarning.main}>{lineItem.unit_discount}</Price>)</>)}
              </TableCell>
              <TableCell>
                {lineItem.amount}
              </TableCell>
              <TableCell>
                <TableCell>
                  <Price>{lineItem.final_price}</Price>
                  {lineItem.total_discount > 0 && (<> (<Price>{lineItem.full_price}</Price><Price negative color={darkWarning.main}>{lineItem.total_discount}</Price>)</>)}
                </TableCell>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              Subtotal
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <Price>{order.original_price}</Price>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Discount
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <Price>{order.total_discount}</Price>
            </TableCell>
          </TableRow>
          {/*<TableRow>*/}
          {/*  <TableCell>*/}
          {/*    VAT (25%)*/}
          {/*  </TableCell>*/}
          {/*  <TableCell />*/}
          {/*  <TableCell />*/}
          {/*  <TableCell>*/}
          {/*    {numeral(order.taxAmount).format(`${order.currencySymbol}0,0.00`)}*/}
          {/*  </TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell>
              Delivery
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <Price>{order.delivery}</Price>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Total
              </Typography>
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                <Price>{order.total_price}</Price>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Scrollbar>
  );
};

OrderSummary.propTypes = {
  error: PropTypes.object,
  isLoading: PropTypes.bool,
  order: PropTypes.object
};
