import React, {useEffect, useState} from 'react';
import Proptypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
import {format} from 'date-fns';
import {
  Box,
  Checkbox,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  Link,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import {Pagination} from '../pagination';
import {ResourceError} from '../resource-error';
import {ResourceUnavailable} from '../resource-unavailable';
import {Scrollbar} from '../scrollbar';
import {VoucherCodeMenu} from "./voucher-code-menu";
import {Status} from "../status";

const columns = [
  {
    id: 'value',
    nonSortable: true,
    label: 'Value'
  },
  {
    id: 'code',
    label: 'Code'
  },
  {
    id: 'used',
    label: 'Used (times)'
  },
  {
    id: 'valid_from',
    label: 'Valid From'
  },
  {
    id: 'valid_until',
    label: 'Valid Until'
  },
  {
    id: 'enabled',
    label: 'Availability'
  }
];

const statusVariants = [
  {
    color: 'success.main',
    label: 'Enabled',
    value: true
  },
  {
    color: 'error.main',
    label: 'Disabled',
    value: false
  }
];

export const VoucherCodesTable = (props) => {
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
    sortBy,
    onReload
  } = props;
  const [dataState, setDataState] = useState(data);

  useEffect(() => {
    setDataState(data);
  }, [data]);

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !data?.length);

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
                === d.enabled);

              return (
                <TableRow
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
                    {d.value}
                  </TableCell>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      sx={{display: 'block'}}
                      to={"/discount/voucher-codes/" + d.id}
                      underline="none"
                      variant="subtitle2"
                    >
                      {d.code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {d.used}x
                  </TableCell>
                  <TableCell>
                    {format(new Date(d.valid_from), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(d.valid_until), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <VoucherCodeMenu
                      id={d.id}
                      enabled={d.enabled}
                      onSuccess={onReload}
                    />
                  </TableCell>
                </TableRow>)
            })
            }
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

VoucherCodesTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

VoucherCodesTable.propTypes = {
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
