import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../contexts/settings-context";
import {Box, Card, Container} from "@material-ui/core";
import {ProductsTable} from "../components/product/products-table";
import ProductCategoriesTable from "../components/product/product-categories-table";

const ProductCategories = () => {
    const [categories, setCategories] = useState({isLoading: true})
    const mounted = useMounted();
    const {language, appName} = useContext(SettingsContext)
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });
    const [
        selectedCategories,
        handleSelect,
        handleSelectAll
    ] = useSelection(categories.data?.categories);
    // const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductCategories} = useContext(APIContext)

    const getCategories = useCallback(async () => {
        setCategories(() => ({ isLoading: true }));

        try {
            const result = await fetchProductCategories({
                page: controller.page,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: controller.filters,
                view: controller.view
            })

            if (mounted.current) {
                setCategories(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCategories(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getCategories().catch(console.error);
    }, [controller]);

    const handleQueryChange = (newQuery) => {
        setController({
            ...controller,
            page: 1,
            filters: [[
                'name->'+language, '["like", "'+newQuery+'"]'
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
                <title>Product Categories | {appName}</title>
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
                    <Card
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1
                        }}
                    >
                        <ProductCategoriesTable
                            error={categories.error}
                            isLoading={categories.isLoading}
                            onPageChange={handlePageChange}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            categories={categories.data ? categories.data : []}
                            pagesCount={categories.paginationMeta ? categories.paginationMeta.last_page : null}
                            categoriesCount={categories.data?.categoriesCount}
                            selectedProductCategories={selectedCategories}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                        />

                    </Card>
                </Container>
            </Box>
        </>
    )
}

export default ProductCategories