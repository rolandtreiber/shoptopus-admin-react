import {useContext, useEffect, useState} from 'react';
import Proptypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
import {
  Box,
  Checkbox,
  Divider, Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel, Typography
} from '@material-ui/core';
import {Pagination} from '../../../components/common-page-components/layout-elements/pagination';
import {ResourceError} from '../../../components/common/placeholder/resource-error';
import {ResourceUnavailable} from '../../../components/common/placeholder/resource-unavailable';
import {Scrollbar} from '../../../components/common/scrollbar';
import {CustomerMenu} from '../../customers/components/customer-menu';
import {Status} from "../../../components/common/status";
import {format} from "date-fns";
import Price from "../../../components/common/price";
import {SettingsContext} from "../../../contexts/settings-context";
import {useTranslation} from "react-i18next";

const columns = [
  {
    id: 'total_price',
    label: 'Price',
  },
  {
    id: 'delivery',
    label: 'Delivery',
  },
  {
    id: 'user',
    label: 'Customer'
  },
  {
    id: 'created_at',
    label: 'Placed At'
  },
  {
    id: 'updated_at',
    label: 'Updated At'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

const statusVariants = [
  {
    color: 'info.main',
    label: 'Awaiting Payment',
    value: 1
  },
  {
    color: 'info.main',
    label: 'Paid',
    value: 2
  },
  {
    color: 'warning.main',
    label: 'Processing',
    value: 3
  },
  {
    color: 'info.main',
    label: 'In Transit',
    value: 4
  },
  {
    color: 'success.main',
    label: 'Completed',
    value: 5
  },
  {
    color: 'warning.main',
    label: 'On Hold',
    value: 6
  },
  {
    color: 'error.main',
    label: 'Cancelled',
    value: 7
  }
];

export const OrdersTable = (props) => {
  const {
    data,
    pagesCount,
    error,
    isLoading,
    onPageChange,
    onSelect,
    onSelectAll,
    onSortChange,
    page,
    selectedElements,
    sort,
    sortBy
  } = props;
  const [dataState, setDataState] = useState(data);

  useEffect(() => {
    setDataState(data);
  }, [data]);

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !data?.length);
  const {language} = useContext(SettingsContext)
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}
    >
      <Scrollbar>
        <Table sx={{minWidth: 1000}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={dataState?.length > 0
                  && selectedElements.length === dataState?.length}
                  disabled={isLoading}
                  indeterminate={selectedElements.length > 0
                  && selectedElements.length < dataState?.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  padding={column.disablePadding ? 'none' : 'normal'}
                >
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sort : 'asc'}
                    disabled={isLoading}
                    hideSortIcon={column.nonSortable === true}
                    onClick={(event) => column.nonSortable !== true && onSortChange(event, column.id)}
                  >
                    {t(column.label)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataState?.map((d) => {
              const statusVariant = statusVariants.find((variant) => variant.value
                === parseInt(d.status));

              return (<TableRow
                  hover
                  key={d.id}
                  selected={!!selectedElements.find((selectedCustomer) => selectedCustomer
                    === d.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!selectedElements.find((selectedCustomer) => selectedCustomer
                        === d.id)}
                      onChange={(event) => onSelect(event, d.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      sx={{display: 'block'}}
                      to={"/admin/orders/" + d.id}
                      underline="none"
                      variant="subtitle2"
                    >
                      {d.total_price}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="inherit"
                    >
                      <Price>{d.delivery}</Price> ({d.delivery_type[language]})
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="inherit"
                    >
                      {d.user}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="inherit"
                    >
                      {format(new Date(d.created_at), 'dd MMM yyyy HH:mm')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="inherit"
                    >
                      {format(new Date(d.updated_at), 'dd MMM yyyy HH:mm')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <CustomerMenu/>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {displayLoading && (
        <Box sx={{p: 2}}>
          <Skeleton height={42}/>
          <Skeleton height={42}/>
          <Skeleton height={42}/>
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
      <Divider sx={{mt: 'auto'}}/>
      <Pagination
        disabled={isLoading}
        onPageChange={onPageChange}
        page={page}
        pagesCount={pagesCount}
      />
    </Box>
  );
};

OrdersTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

OrdersTable.propTypes = {
  data: Proptypes.array,
  pagesCount: Proptypes.number,
  error: Proptypes.string,
  isLoading: Proptypes.bool,
  onPageChange: Proptypes.func,
  onSelect: Proptypes.func,
  onSelectAll: Proptypes.func,
  onSortChange: Proptypes.func,
  page: Proptypes.number,
  selectedElements: Proptypes.array,
  sort: Proptypes.oneOf(['asc', 'desc']),
  sortBy: Proptypes.string
};
