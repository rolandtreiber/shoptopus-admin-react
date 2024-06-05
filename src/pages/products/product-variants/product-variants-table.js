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
  TableSortLabel,
} from '@material-ui/core';
import { Pagination } from '../../../components/common-page-components/layout-elements/pagination';
import { ResourceError } from '../../../components/common/placeholder/resource-error';
import { ResourceUnavailable } from '../../../components/common/placeholder/resource-unavailable';
import { Scrollbar } from '../../../components/common/scrollbar';
import Price from "../../../components/common/price";
import { CustomCube as CubeIcon } from '../../../icons/custom-cube';
import {useLanguage} from "../../../hooks/use-language";
import {Status} from "../../../components/common/status";
import {useTranslation} from "react-i18next";
import {TrTypography} from "../../../components/common/translated/translated-typography";

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
  },
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

export const ProductVariantsTable = (props) => {
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
  const { t } = useTranslation();

  const getName = (variant) => {
    return variant.attributes.map(attribute => attribute.option && getLang(attribute.option.name)).join(', ')
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
                    {t(column.label)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((variant) => {
              const statusVariant = statusVariants.find((statusVariant) => statusVariant.value
                === variant.enabled);

              return (
                <TableRow
                  hover
                  key={variant.id}
                  selected={!!selectedElements.find((selectedElement) => selectedElement
                    === variant.id)}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={variant.image ? variant.image.url : null}
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
                      {getName(variant)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Price>{variant.price}</Price>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      {format(new Date(variant.created_at), 'MMM dd yyyy')}
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
                      <TrTypography
                        color="primary"
                        sx={{cursor: 'pointer'}}
                        onClick={() => {
                          onEdit(variant)
                        }}
                        variant="subtitle2"
                      >
                        Edit
                      </TrTypography>
                      <Divider
                        flexItem
                        orientation="vertical"
                        sx={{mx: 2}}
                      />
                      <TrTypography
                        color="primary"
                        onClick={() => {
                          onDelete(variant)
                        }}
                        sx={{cursor: 'pointer'}}
                        variant="subtitle2"
                      >
                        Delete
                      </TrTypography>
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

ProductVariantsTable.defaultProps = {
  page: 1,
  data: [],
  selectedElements: [],
  sort: 'desc',
  sortBy: 'createdAt'
};

ProductVariantsTable.propTypes = {
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
