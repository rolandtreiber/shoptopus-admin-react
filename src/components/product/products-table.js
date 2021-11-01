import Proptypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@material-ui/core';
import { Pagination } from '../pagination';
import { ResourceError } from '../resource-error';
import { ResourceUnavailable } from '../resource-unavailable';
import { Scrollbar } from '../scrollbar';
import { Status } from '../status';
import { ProductMenu } from './product-menu';
import {useContext} from "react";
import {SettingsContext} from "../../contexts/settings-context";
import Price from "../price";
import {darkWarning} from "../../colors";

const columns = [
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'price',
    label: 'price'
  },
  {
    id: 'updated_at',
    label: 'Updated'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

const statusVariants = [
  {
    color: 'info.main',
    label: 'Provisional',
    value: 0
  },
  {
    color: 'success.main',
    label: 'Active',
    value: 1
  },
  {
    color: 'error.main',
    label: 'Discontinued',
    value: 2
  }
];

export const ProductsTable = (props) => {
  const {
    error,
    isLoading,
    onPageChange,
    onSelect,
    onSelectAll,
    onSortChange,
    page,
    pagesCount,
    products,
    selectedProducts,
    sort,
    sortBy
  } = props;

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !products.length);
  const {language} = useContext(SettingsContext)

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}
    >
      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={products.length > 0
                  && selectedProducts.length === products.length}
                  disabled={isLoading}
                  indeterminate={selectedProducts.length > 0
                  && selectedProducts.length < products.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sort : 'asc'}
                    disabled={isLoading}
                    onClick={(event) => onSortChange(event, column.id, column.translatable)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const statusVariant = statusVariants.find((variant) => variant.value
                === product.status);

              return (
                <TableRow
                  hover
                  key={product.id}
                  selected={!!selectedProducts.find((selectedCustomer) => selectedCustomer
                    === product.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!selectedProducts.find((selectedCustomer) => selectedCustomer
                        === product.id)}
                      onChange={(event) => onSelect(event, product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        alt={product.name[language]}
                        src={product.cover_photo_url}
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
                          to={"/dashboard/products/"+product.id}
                          underline="none"
                          variant="subtitle2"
                        >
                          {product.name[language]}
                        </Link>
                        <Typography
                          color="textSecondary"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {product.stock} in stock
                          {product.variants > 0 && ' for '+product.variants+ ' variant'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Price>{product.price}</Price>{product.final_price !== product.price && (<>(<Price negative color={darkWarning.main}>{product.price - product.final_price}</Price>)</>)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Typography
                        color="inherit"
                        variant="body2"
                      >
                        {format(new Date(product.updated_at), 'dd MMM yyyy')}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {format(new Date(product.updated_at), 'HH:mm')}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ProductMenu />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {displayLoading && (
        <Box sx={{ p: 2 }}>
          <Skeleton height={42} />
          <Skeleton height={42} />
          <Skeleton height={42} />
        </Box>
      )}
      {displayError && (
        <ResourceError
          error={error}
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      {displayUnavailable && (
        <ResourceUnavailable
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      <Divider sx={{ mt: 'auto' }} />
      <Pagination
        disabled={isLoading}
        onPageChange={onPageChange}
        page={page}
        pagesCount={pagesCount}
      />
    </Box>
  );
};

ProductsTable.defaultProps = {
  page: 1,
  products: [],
  productsCount: 0,
  selectedProducts: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

ProductsTable.propTypes = {
  error: Proptypes.string,
  isLoading: Proptypes.bool,
  onPageChange: Proptypes.func,
  onSelect: Proptypes.func,
  onSelectAll: Proptypes.func,
  onSortChange: Proptypes.func,
  page: Proptypes.number,
  products: Proptypes.array,
  productsCount: Proptypes.number,
  selectedProducts: Proptypes.array,
  sort: Proptypes.oneOf(['asc', 'desc']),
  sortBy: Proptypes.string
};
