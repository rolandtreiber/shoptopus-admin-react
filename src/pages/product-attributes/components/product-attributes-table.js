import {useContext} from 'react'
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
import {Scrollbar} from "../../../components/common/scrollbar";
import {Link as RouterLink} from 'react-router-dom';
import {ResourceError} from "../../../components/common/placeholder/resource-error";
import {ResourceUnavailable} from "../../../components/common/placeholder/resource-unavailable";
import {Pagination} from "../../../components/common-page-components/layout-elements/pagination";
import {Status} from "../../../components/common/status";
import {format} from "date-fns";
import {ProductAttributeMenu} from "./product-attribute-menu";
import NoImg from '../../../static/images/no-image.png'
import {useTranslation} from "react-i18next";

const columns = [
  {
    id: 'image',
    label: 'Image'
  },
  {
    id: 'name',
    label: 'Name',
    translatable: true
  },
  {
    id: 'updated_at',
    label: 'Updated'
  },
  {
    id: 'enabled',
    label: 'Enabled'
  }
];

const types = ['text', 'image', 'color']

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

const ProductAttributesTable = (props) => {
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
                    {t(column.label)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(attribute => {
              const statusVariant = statusVariants.find((variant) => variant.value
                === attribute.enabled);

              return (<TableRow
                  hover
                  key={attribute.id}
                  selected={!!selectedElements.find((selectedCustomer) => selectedCustomer
                    === attribute.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!selectedElements.find((selectedCustomer) => selectedCustomer
                        === attribute.id)}
                      onChange={(event) => onSelect(event, attribute.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {<Avatar
                      alt={attribute.name[language]}
                      src={attribute.image ? attribute.image : NoImg}
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
                        to={"/admin/product-attributes/" + attribute.id}
                        underline="none"
                        variant="subtitle2"
                      >
                        {attribute.name[language]}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      {format(new Date(attribute.updated_at), 'dd MMM yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Status
                      color={statusVariant.color}
                      label={statusVariant.label}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ProductAttributeMenu
                      id={attribute.id}
                      onSuccess={onReload}
                      enabled={attribute.enabled}
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

export default ProductAttributesTable