import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@material-ui/core';
import { ProductCreateDialog } from '../components/product/product-create-dialog';
import { ProductsFilter } from '../components/product/products-filter';
import { ProductsSummary } from '../components/product/products-summary';
import { ProductsTable } from '../components/product/products-table';
import { useMounted } from '../hooks/use-mounted';
import { useSelection } from '../hooks/use-selection';
import { Plus as PlusIcon } from '../icons/plus';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {SettingsContext} from "../contexts/settings-context";

// TODO: implement the right api

export const Ratings = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });
    const {language, appName} = useContext(SettingsContext)
    const [productsState, setProductsState] = useState({ isLoading: true });
    const [
        selectedProducts,
        handleSelect,
        handleSelectAll
    ] = useSelection(productsState.data?.products);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProducts} = useContext(APIContext)

    const getProducts = useCallback(async () => {
        setProductsState(() => ({ isLoading: true }));

        try {
            const result = await fetchProducts({
                page: controller.page,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: controller.filters,
                view: controller.view
            })

            if (mounted.current) {
                setProductsState(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setProductsState(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getProducts().catch(console.error);
    }, [controller]);

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    const handleViewChange = (newView) => {
        setController({
            ...controller,
            page: 0,
            view: newView
        });
    };

    const handleQueryChange = (newQuery) => {
        setController({
            ...controller,
            page: 1,
            filters: [[
                'name->'+language, '["contains", "'+newQuery+'"]'
            ]]
        });
    };

    const handleFiltersApply = (newFilters) => {
        const parsedFilters = newFilters.map((filter) => ({
            property: filter.property.name,
            value: filter.value,
            operator: filter.operator.value
        }));

        setController({
            ...controller,
            page: 0,
            filters: parsedFilters
        });
    };

    const handleFiltersClear = () => {
        setController({
            ...controller,
            page: 0,
            filters: []
        });
    };

    const handlePageChange = (newPage) => {
        setController({
            ...controller,
            page: newPage - 1
        });
    };

    const handleSortChange = (event, property, translatable) => {
        const isAsc = translatable === true ? controller.sortBy === property+'->'+language && controller.sort === 'asc' : controller.sortBy === property && controller.sort === 'asc';

        setController({
            ...controller,
            page: 0,
            sort: isAsc ? 'desc' : 'asc',
            sortBy: translatable === true ? property+'->'+language : property
        });
    };

    return (
        <>
            <Helmet>
                <title>System Users | {appName}</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <Box sx={{ py: 4 }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                Products
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                color="primary"
                                onClick={() => setOpenCreateDialog(true)}
                                size="large"
                                startIcon={<PlusIcon fontSize="small" />}
                                variant="contained"
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                    <ProductsSummary />
                    <Card
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1
                        }}
                    >
                        <ProductsFilter
                            disabled={productsState.isLoading}
                            filters={controller.filters}
                            onFiltersApply={handleFiltersApply}
                            onFiltersClear={handleFiltersClear}
                            onQueryChange={handleQueryChange}
                            onViewChange={handleViewChange}
                            query={controller.query}
                            selectedProducts={selectedProducts}
                            view={controller.view}
                        />
                        <Divider />
                        <ProductsTable
                            error={productsState.error}
                            isLoading={productsState.isLoading}
                            onPageChange={handlePageChange}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            products={productsState.data ? productsState.data : []}
                            pagesCount={productsState.paginationMeta ? productsState.paginationMeta.last_page : null}
                            productsCount={productsState.data?.productsCount}
                            selectedProducts={selectedProducts}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                        />
                    </Card>
                </Container>
            </Box>
            <ProductCreateDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
            />
        </>
    );
};
