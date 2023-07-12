import {useContext, useEffect, useState} from 'react';
import Proptypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
import {
  Avatar,
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
import {Pagination} from '../layout-elements/pagination';
import {ResourceError} from '../../common/placeholder/resource-error';
import {ResourceUnavailable} from '../../common/placeholder/resource-unavailable';
import {Scrollbar} from '../../common/scrollbar';
import {CustomerMenu} from '../customer/customer-menu';
import {SettingsContext} from "../../../contexts/settings-context";
import {Status} from "../../common/status";

const columns = [
  {
    id: 'image',
    label: 'Image',
    nonSortable: true
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
    id: 'type',
    label: 'Type'
  }
];

const statusVariants = [
  {
    color: 'success.main',
    label: 'Image',
    value: 0
  },
  {
    color: 'success.main',
    label: 'Video',
    value: 1
  },
  {
    color: 'success.main',
    label: 'Audio',
    value: 2
  },
  {
    color: 'success.main',
    label: 'Pdf',
    value: 3
  },
  {
    color: 'success.main',
    label: 'Spreadsheet',
    value: 4
  },
  {
    color: 'success.main',
    label: 'Text Document',
    value: 5
  },
  {
    color: 'success.main',
    label: 'Other',
    value: 6
  },
];

export const FilesTable = (props) => {
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
                    onClick={(event) => column.nonSortable !== true && onSortChange(event, column.id)}
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
                    <Avatar
                      alt={d.title[language]}
                      src={d.url}
                      sx={{
                        width: 64,
                        height: 64
                      }}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      sx={{display: 'block'}}
                      to={"/content/files/" + d.id}
                      underline="none"
                      variant="subtitle2"
                    >
                      {d.title[language]}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {d.description[language]}
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

FilesTable.defaultProps = {
  data: [],
  pagesCount: 0,
  page: 1,
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

FilesTable.propTypes = {
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
