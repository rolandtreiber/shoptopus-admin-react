import React, {useContext} from 'react'
import {SettingsContext} from "../../contexts/settings-context";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Link, Skeleton, Divider, Avatar
} from "@material-ui/core";
import {Scrollbar} from "../scrollbar";
import {Link as RouterLink} from 'react-router-dom';
import {ProductMenu} from "../product/product-menu";
import {ResourceError} from "../resource-error";
import {ResourceUnavailable} from "../resource-unavailable";
import {Pagination} from "../pagination";
import {Status} from "../status";
import {format} from "date-fns";
import {ProductTagMenu} from "./product-tag-menu";

const columns = [
  {
    id: 'badge',
    label: 'Badge'
  },
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'description',
    label: 'Description',
    translatable: true
  },
  {
    id: 'updated_at',
    label: 'Updated'
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

const ProductTagsTable = (props) => {
  const {
    error,
    isLoading,
    onPageChange,
    onSelect,
    onSelectAll,
    onSortChange,
    page,
    pagesCount,
    data,
    selectedElements,
    sort,
    sortBy,
    onReload
  } = props;

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !data.length);
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
        <Table sx={{minWidth: 800}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={data.length > 0
                  && selectedElements.length === data.length}
                  disabled={isLoading}
                  indeterminate={selectedElements.length > 0
                  && selectedElements.length < data.length}
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
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(tag => {
              const statusVariant = statusVariants.find((variant) => variant.value
                === tag.enabled);

              return (<TableRow
                  hover
                  key={tag.id}
                  selected={!!selectedElements.find((selectedCustomer) => selectedCustomer
                    === tag.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!selectedElements.find((selectedCustomer) => selectedCustomer
                        === tag.id)}
                      onChange={(event) => onSelect(event, tag.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {tag.badge && <Avatar
                      alt={tag.name[language]}
                      src={tag.badge}
                      sx={{
                        width: 64,
                        height: 64
                      }}
                      variant="rounded"
                    />}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Link
                        color="inherit"
                        component={RouterLink}
                        sx={{display: 'block'}}
                        to={"/product-tags/" + tag.id}
                        underline="none"
                        variant="subtitle2"
                      >
                        {tag.name[language]}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      {tag.description[language]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      {format(new Date(tag.updated_at), 'dd MMM yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ProductTagMenu
                      id={tag.id}
                      enabled={tag.enabled}
                      onSuccess={onReload}
                    />
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
    </Box>)
}

export default ProductTagsTable