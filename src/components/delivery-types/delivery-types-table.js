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
import {SettingsContext} from "../../contexts/settings-context";
import Price from "../price";
import {Status} from "../status";
import {DeliveryTypeMenu} from "./delivery-type-menu";

const columns = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'description',
    label: 'Description'
  },
  {
    id: 'price',
    label: 'Price'
  },
  {
    id: 'order_count',
    label: 'Orders',
    nonSortable: true
  },
  {
    id: 'total_revenue',
    label: 'Total Revenue',
    nonSortable: true
  },
  {
    id: 'status',
    label: 'Status'
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

export const DeliveryTypesTable = (props) => {
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
                === d.enabled);

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
                    to={"/dashboard/delivery-types/" + d.id}
                    underline="none"
                    variant="subtitle2"
                  >
                    {d.name[language]}
                  </Link>
                </TableCell>
                <TableCell>
                  {d.description[language]}
                </TableCell>
                <TableCell>
                  <Price>{d.price}</Price>
                </TableCell>
                <TableCell>
                  {d.order_count}
                </TableCell>
                <TableCell>
                  <Price>{d.total_revenue}</Price>
                </TableCell>
                <TableCell>
                  <Status
                    color={statusVariant.color}
                    label={statusVariant.label}
                  />
                </TableCell>
                <TableCell align="right">
                  <DeliveryTypeMenu
                    id={d.id}
                    enabled={d.enabled}
                    onSuccess={onReload}
                  />
                </TableCell>
              </TableRow>)
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

DeliveryTypesTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

DeliveryTypesTable.propTypes = {
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
