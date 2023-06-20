import Proptypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel, Typography,
} from '@material-ui/core';
import { Pagination } from '../layout-elements/pagination';
import { ResourceError } from '../../common/placeholder/resource-error';
import { ResourceUnavailable } from '../../common/placeholder/resource-unavailable';
import { Scrollbar } from '../../common/scrollbar';
import Price from "../../common/price";
import { CustomCube as CubeIcon } from '../../../icons/custom-cube';
import {useLanguage} from "../../../hooks/use-language";
import {Status} from "../../common/status";
import React from "react";

const columns = [
  {
    id: 'image',
    label: 'First Image',
    translatable: true
  },
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'common_value',
    label: 'value'
  },
  {
    id: 'enabled',
    label: 'enabled'
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

export const ProductAttributeOptionsTable = (props) => {
  const {
    error,
    isLoading,
    onPageChange,
    onSortChange,
    page,
    pagesCount,
    data,
    selectedElements,
    sort,
    sortBy,
    onEdit,
    onDelete
  } = props;

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !data.length);
  const {getLang} = useLanguage()

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
            {data.map((option) => {
              const statusVariant = statusVariants.find((statusVariant) => statusVariant.value
                === option.enabled);

              return (
                <TableRow
                  hover
                  key={option.id}
                  selected={!!selectedElements.find((selectedElement) => selectedElement
                    === option.id)}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={option.image ? option.image : null}
                        sx={{
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                          height: 48,
                          mr: 2,
                          width: 48
                        }}
                        variant="rounded"
                      >
                        <CubeIcon/>
                      </Avatar>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      {getLang(option.name)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      {option.value}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell sx={{width: 135}}>
                    <Box sx={{display: 'flex'}}>
                      <Typography
                        color="primary"
                        sx={{cursor: 'pointer'}}
                        onClick={() => {
                          onEdit(option)
                        }}
                        variant="subtitle2"
                      >
                        Edit
                      </Typography>
                      <Divider
                        flexItem
                        orientation="vertical"
                        sx={{mx: 2}}
                      />
                      <Typography
                        color="primary"
                        onClick={() => {
                          onDelete(option)
                        }}
                        sx={{cursor: 'pointer'}}
                        variant="subtitle2"
                      >
                        Delete
                      </Typography>
                    </Box>
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

ProductAttributeOptionsTable.defaultProps = {
  page: 1,
  data: [],
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

ProductAttributeOptionsTable.propTypes = {
  error: Proptypes.string,
  isLoading: Proptypes.bool,
  onPageChange: Proptypes.func,
  onSelect: Proptypes.func,
  onSelectAll: Proptypes.func,
  onSortChange: Proptypes.func,
  page: Proptypes.number,
  data: Proptypes.array,
  selectedElements: Proptypes.array,
  sort: Proptypes.oneOf(['asc', 'desc']),
  sortBy: Proptypes.string
};
