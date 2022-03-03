import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";
import {Helmet} from "react-helmet-async";
import {Box, Button, Card, Container, Divider, Typography} from "@material-ui/core";
import {Plus as PlusIcon} from "../icons/plus";
import ProductTagsTable from "../components/product-tags/product-tags-table";
import {SettingsContext} from "../contexts/settings-context";
import {getUrlFilters} from "../utils/apply-filters";
import {ListFilter} from "../components/list-filter";
import {ProductTagCreateDialog} from "../components/product-tags/product-tag-create-dialog";

const filterProperties = [
    {
        label: 'Name',
        name: 'name',
        type: 'string'
    },
    {
        label: 'Description',
        name: 'description',
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

const ProductTags = () => {
    const [tags, setTags] = useState({isLoading: true})
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
        selectedElements,
        handleSelect,
        handleSelectAll,
        mergeSelectableRows
    ] = useSelection();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductTags} = useContext(APIContext)

    useEffect(() => {
        if (tags.data) {
            mergeSelectableRows(tags.data)
        }
    }, [tags])

    const getAttributes = useCallback(async () => {
        setTags(() => ({ isLoading: true }));

        try {
            const result = await fetchProductTags({
                page: controller.page+1,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: getUrlFilters(controller.filters),
                view: controller.view
            })

            if (mounted.current) {
                setTags(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setTags(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getAttributes().catch(console.error);
    }, [controller]);

    const handleQueryChange = (newQuery) => {
        setController({
            ...controller,
            page: 1,
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

    const handleBulkAvailabilityUpdate = (available) => {
        console.log('Availability updated to '+(available === true ? 'Enabled' : 'Disabled'))
    }

    const handleBulkDelete = () => {
        console.log('Deleted')
    }

    return (
        <>
            <Helmet>
                <title>Product Tags | {appName}</title>
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
                                Product Tags
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
                            disabled={tags.isLoading}
                            filters={controller.filters}
                            onFiltersApply={(data) => setController({...controller, ...data})}
                            onFiltersClear={(data) => setController({...controller, ...data})}
                            onQueryChange={handleQueryChange}
                            onViewChange={handleViewChange}
                            query={controller.query}
                            selectedElements={selectedElements}
                            view={controller.view}
                            filterProperties={filterProperties}
                            views={views}
                            bulkMenuItems={[
                                {
                                    name: 'Enable',
                                    callback: () => handleBulkAvailabilityUpdate(true)
                                },
                                {
                                    name: 'Disable',
                                    callback: () => handleBulkAvailabilityUpdate(false)
                                },
                                {
                                    name: 'Delete',
                                    callback: () => handleBulkDelete()
                                }
                            ]}
                        />
                        <Divider />
                        <ProductTagsTable
                            error={tags.error}
                            isLoading={tags.isLoading}
                            onPageChange={(page) => setController({...controller, page:page-1})}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            data={tags.data ? tags.data : []}
                            pagesCount={tags.paginationMeta ? tags.paginationMeta.last_page : null}
                            elementsCount={tags.data?.categoriesCount}
                            selectedElements={selectedElements}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                        />

                    </Card>
                </Container>
            </Box>
            <ProductTagCreateDialog
              onClose={() => setOpenCreateDialog(false)}
              open={openCreateDialog}
              onSuccess={() => getAttributes().catch(console.error)}
            />
        </>
    )
}

export default ProductTags