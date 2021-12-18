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
    Link, Skeleton, Divider
} from "@material-ui/core";
import {Scrollbar} from "../scrollbar";
import { Link as RouterLink } from 'react-router-dom';
import {ProductMenu} from "../product/product-menu";
import {ResourceError} from "../resource-error";
import {ResourceUnavailable} from "../resource-unavailable";
import {Pagination} from "../pagination";
import {Status} from "../status";
import {format} from "date-fns";

const columns = [
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
        sortBy
    } = props;

    const displayLoading = isLoading;
    const displayError = Boolean(!isLoading && error);
    const displayUnavailable = Boolean(!isLoading && !error && !categories.length);
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
                        {categories.map(category => {
                            const statusVariant = statusVariants.find((variant) => variant.value
                                === category.enabled);

                            return (<TableRow
                                hover
                                key={category.id}
                                selected={!!selectedProductCategories.find((selectedCustomer) => selectedCustomer
                                    === category.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={!!selectedProductCategories.find((selectedCustomer) => selectedCustomer
                                            === category.id)}
                                        onChange={(event) => onSelect(event, category.id)}
                                    />
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
                                            sx={{ display: 'block' }}
                                            to={"/dashboard/product-categories/"+category.id}
                                            underline="none"
                                            variant="subtitle2"
                                        >
                                            {category.name[language]}
                                        </Link>
                                        {category.children.length > 0 && (<Typography
                                            sx={{
                                                color: 'success.main',
                                                ml: 1.75
                                            }}
                                            variant="body2"
                                        >({category.children.length} sub {category.children.length === 1 ? 'category' : 'categories'})</Typography>)}
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
                                            sx={{ mt: 1 }}
                                            variant="body2"
                                        >
                                            {category.description[language]}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        color="inherit"
                                        variant="body2"
                                    >
                                        {format(new Date(category.updated_at), 'dd MMM yyyy')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Status
                                        color={statusVariant.color}
                                        label={statusVariant.label}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <ProductMenu />
                                </TableCell>
                            </TableRow>
                        )})}
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
        </Box>)
}

export default ProductCategoriesTable