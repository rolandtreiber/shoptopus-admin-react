import React, {useContext, useEffect, useState} from 'react';
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
  TableSortLabel
} from '@material-ui/core';
import {Pagination} from '../pagination';
import {ResourceError} from '../resource-error';
import {ResourceUnavailable} from '../resource-unavailable';
import {Scrollbar} from '../scrollbar';
import {CustomerMenu} from '../customer/customer-menu';
import {SettingsContext} from "../../contexts/settings-context";
import Price from "../price";
import {Status} from "../status";

const columns = [
  {
    id: 'description',
    label: 'Description'
  },
  {
    id: 'price',
    label: 'Price'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

const statusVariants = [
  {
    color: 'success.main',
    label: 'Payment',
    value: 0
  },
  {
    color: 'error.main',
    label: 'Refund',
    value: 1
  }
];

export const TransactionsTable = (props) => {
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
                    onClick={(event) => onSortChange(event, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataState?.map((d) => {
              const statusVariant = statusVariants.find((variant) => variant.value
                === d.type);

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
                    to={"/dashboard/transactions/" + d.id}
                    underline="none"
                    variant="subtitle2"
                  >
                    {d.description}
                  </Link>
                </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell>
                    <Price>{d.amount}</Price>
                  </TableCell>
                <TableCell align="right">
                  <CustomerMenu/>
                </TableCell>
              </TableRow>
            )})}
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

TransactionsTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

TransactionsTable.propTypes = {
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
