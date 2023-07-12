import React, {useContext} from 'react'
import {SettingsContext} from "../../../contexts/settings-context";
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
  TableHead, TableRow, TableSortLabel, Typography
} from "@material-ui/core";
import {Scrollbar} from "../../common/scrollbar";
import {Link as RouterLink} from 'react-router-dom';
import {ResourceError} from "../../common/placeholder/resource-error";
import {ResourceUnavailable} from "../../common/placeholder/resource-unavailable";
import {Pagination} from "../layout-elements/pagination";
import {Status} from "../../common/status";
import {format} from "date-fns";
import RightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import {ProductCategoryMenu} from "./product-category-menu";

const columns = [
  {
    id: 'menu_image',
    label: 'Menu Image'
  },
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'description',
    label: 'description',
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

const ProductCategoriesTable = (props) => {
  const {
    error,
    isLoading,
    onPageChange,
    onSelect,
    onSelectAll,
    onSortChange,
    page,
    pagesCount,
    categories,
    selectedProductCategories,
    sort,
    sortBy,
    onReload
  } = props;

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !categories.length);
  const {language} = useContext(SettingsContext)

  const getRow = (rowData, level = 1) => {
    const statusVariant = statusVariants.find((variant) => variant.value
      === rowData.enabled);

    return (
      <React.Fragment key={rowData.id}>
        <TableRow
          hover
          selected={!!selectedProductCategories.find((selectedCustomer) => selectedCustomer
            === rowData.id)}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={!!selectedProductCategories.find((selectedCustomer) => selectedCustomer
                === rowData.id)}
              onChange={(event) => onSelect(event, rowData.id)}
            />
          </TableCell>
          <TableCell>
            {rowData.menu_image && <Avatar
              alt={rowData.name[language]}
              src={rowData.menu_image}
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
                alignItems: 'top',
                display: 'flex'
              }}
              style={{"marginLeft": (level - 1) * 15 + "px"}}
            >
              {level > 1 &&
              <Box mt={0.5}>
                <RightIcon fontSize={"0.8em"}/>
              </Box>
              }
              <Link
                color="inherit"
                component={RouterLink}
                sx={{display: 'block'}}
                to={"/product-categories/" + rowData.id}
                underline="none"
                variant="subtitle2"
              >
                {rowData.name[language]}
              </Link>
              {rowData.children.length > 0 && (<Typography
                sx={{
                  color: 'success.main',
                  ml: 1.75
                }}
                variant="body2"
              >({rowData.children.length} sub {rowData.children.length === 1 ? 'category' : 'categories'})</Typography>)}
            </Box>
          </TableCell>
          <TableCell>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Typography
                color="textSecondary"
                sx={{mt: 1}}
                variant="body2"
              >
                {rowData.description[language]}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Typography
              color="inherit"
              variant="body2"
            >
              {format(new Date(rowData.updated_at), 'dd MMM yyyy')}
            </Typography>
          </TableCell>
          <TableCell>
            <Status
              color={statusVariant.color}
              label={statusVariant.label}
            />
          </TableCell>
          <TableCell align="right">
            <ProductCategoryMenu
              id={rowData.id}
              onSuccess={onReload}
              enabled={rowData.enabled}
            />
          </TableCell>
        </TableRow>
        {rowData.children && rowData.children.map(child => getRow(child, level + 1))}
      </React.Fragment>
    )
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
        <Table sx={{minWidth: 800}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={categories.length > 0
                  && selectedProductCategories.length === categories.length}
                  disabled={isLoading}
                  indeterminate={selectedProductCategories.length > 0
                  && selectedProductCategories.length < categories.length}
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
            {categories.map(category =>
              getRow(category)
            )}
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

export default ProductCategoriesTable