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
    Typography
} from "@material-ui/core";
import {Scrollbar} from "../scrollbar";
import { Link as RouterLink } from 'react-router-dom';
import {Link} from "../../icons/link";

const columns = [
    {
        id: 'name',
        label: 'Name',
        translatable: true
    },
    {
        id: 'description',
        label: 'description'
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
                        {categories.map(category => (

                            <TableRow
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
                            </TableRow>


                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Box>)
}

export default ProductCategoriesTable