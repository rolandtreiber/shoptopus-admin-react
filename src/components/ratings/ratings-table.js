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
import { Star as StarIcon } from '../../icons/star';
import {Status} from "../status";
import {format} from "date-fns";

const columns = [
  {
    id: 'rating',
    label: 'Rating'
  },
  {
    id: 'title',
    label: 'Title'
  },
  {
    id: 'description',
    label: 'Description'
  },
  {
    id: 'user_name',
    label: 'User'
  },
  {
    id: 'enabled',
    label: 'Enabled'
  },
  {
    id: 'verified',
    label: 'Verified'
  },
  {
    id: 'created_at',
    label: 'Left At'
  }
];

const statusVariantsEnabled = [
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

const statusVariantsVerified = [
  {
    color: 'success.main',
    label: 'Verified',
    value: true
  },
  {
    color: 'error.main',
    label: 'Non Verified',
    value: false
  }
];

export const RatingsTable = (props) => {
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

  const getStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars = [...stars, (<StarIcon key={'star-'+i} style={{'color': '#cebf17'}}/>)]
    }
    return stars
  }

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
              const statusVariantEnabled = statusVariantsEnabled.find((variant) => variant.value
                === d.enabled);
              const statusVariantVerified = statusVariantsVerified.find((variant) => variant.value
                === d.verified);

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
                      to={"/dashboard/rating/" + d.id}
                      underline="none"
                      variant="subtitle2"
                    >
                      {getStars(d.rating)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {d.title}
                  </TableCell>
                  <TableCell>
                    {d.description}
                  </TableCell>
                  <TableCell>
                    {d.user_name}
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariantEnabled.color}
                      label={statusVariantEnabled.label}
                    />
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariantVerified.color}
                      label={statusVariantVerified.label}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(d.left_at), 'dd/MM/yyyy HH:mm')}
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

RatingsTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

RatingsTable.propTypes = {
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
