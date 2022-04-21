import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../contexts/settings-context";
import {Box, Button, Card, Container, Divider, Typography} from "@material-ui/core";
import ProductCategoriesTable from "../components/product-categories/product-categories-table";
import {getUrlFilters} from "../utils/apply-filters";
import {Plus as PlusIcon} from "../icons/plus";
import {ListFilter} from "../components/list-filter";
import {ProductCategoryCreateDialog} from "../components/product-categories/product-category-create-dialog";
import {DialogContext} from "../contexts/dialog-context";

const filterProperties = [
    {
        label: 'Name',
        name: 'name',
        type: 'string'
    },
    {
        label: 'Updated At',
        name: 'updated_at',
        type: 'date'
    }
];

const views = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Enabled',
        value: 'enabled'
    },
    {
        label: 'Disabled',
        value: 'disabled'
    }
];

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
        handleSelectAll,
        setRows,
        mergeSelectableRows,
        clearSelected
    ] = useSelection();
    const {
        setCallback,
        setTitle,
        showGenericDialog,
        setDescription
    } = useContext(DialogContext)[1]
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductCategories,
        bulkDeleteProductCategories,
        bulkUpdateProductCategoriesAvailability} = useContext(APIContext)

    useEffect(() => {
        if (categories.data) {
            mergeSelectableRows(categories.data)
        }
    }, [categories])

    const getCategories = useCallback(async (clearWhileLoading = true) => {
        clearWhileLoading && setCategories(() => ({ isLoading: true }));

        try {
            const result = await fetchProductCategories({
                page: controller.page+1,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: getUrlFilters(controller.filters),
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
            page: 0,
            filters: [{
                property: 'name->'+language,
                value: newQuery,
                operator: "contains"
            }]
        });
    };

    const handleViewChange = (newView) => {
        setController({
            ...controller,
            page: 0,
            view: newView
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

    const doBulkUpdateAvailability = useCallback( async (ids, availability) => {
        try {
            return await bulkUpdateProductCategoriesAvailability({
                availability: availability,
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkDelete = useCallback( async (ids) => {
        try {
            return await bulkDeleteProductCategories({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const handleBulkAvailabilityUpdate = (available) => {
        const call = () => doBulkUpdateAvailability(selectedCategories, available).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                getCategories().catch(console.error);
            }
        })

        const newStatus = available ? 'enabled' : 'disabled'

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to set the selected product categories '+newStatus+'.')
        showGenericDialog(true)
    }

    const handleBulkDelete = () => {
        const call = () => doBulkDelete(selectedCategories).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                getCategories().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to delete the selected product categories.')
        showGenericDialog(true)
    }

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
                                Product Categories
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

                    <Card
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1
                        }}
                    >
                        <ListFilter
                            disabled={categories.isLoading}
                            filters={controller.filters}
                            onFiltersApply={(data) => setController({...controller, ...data})}
                            onFiltersClear={(data) => setController({...controller, ...data})}
                            onQueryChange={handleQueryChange}
                            onViewChange={handleViewChange}
                            query={controller.query}
                            selectedElements={selectedCategories}
                            view={controller.view}
                            filterProperties={filterProperties}
                            views={views}
                            bulkMenuItems={[
                                {
                                    name: 'Enable',
                                    callback: () => handleBulkAvailabilityUpdate(1)
                                },
                                {
                                    name: 'Disable',
                                    callback: () => handleBulkAvailabilityUpdate(0)
                                },
                                {
                                    name: 'Delete',
                                    callback: () => handleBulkDelete()
                                }
                            ]}
                        />
                        <Divider />
                        <ProductCategoriesTable
                            error={categories.error}
                            isLoading={categories.isLoading}
                            onPageChange={(page) => setController({...controller, page:page-1})}
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
                            onReload={() => getCategories(false)}
                        />

                    </Card>
                </Container>
            </Box>
            <ProductCategoryCreateDialog
              onClose={() => setOpenCreateDialog(false)}
              open={openCreateDialog}
              onSuccess={() => getCategories().catch(console.error)}
            />
        </>
    )
}

export default ProductCategories