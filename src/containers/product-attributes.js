import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";
import {Box, Button, Card, Container, Divider, Typography} from "@material-ui/core";
import {Plus as PlusIcon} from "../icons/plus";
import ProductAttributesTable from "../components/product/product-attributes-table";
import {SettingsContext} from "../contexts/settings-context";
import {getUrlFilters} from "../utils/apply-filters";
import {Helmet} from "react-helmet-async";
import {ListFilter} from "../components/list-filter";

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

const ProductAttributes = () => {
    const [attributes, setAttributes] = useState({isLoading: true})
    const mounted = useMounted();
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
        handleSelectAll
    ] = useSelection(attributes.data?.attributes);
    const {language, appName} = useContext(SettingsContext)

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductAttributes} = useContext(APIContext)

    const getAttributes = useCallback(async () => {
        setAttributes(() => ({ isLoading: true }));

        try {
            const result = await fetchProductAttributes({
                page: controller.page+1,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: getUrlFilters(controller.filters),
                view: controller.view
            })

            if (mounted.current) {
                setAttributes(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setAttributes(() => ({
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
                <title>Product Attributes | {appName}</title>
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
                                Product Attributes
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
                            disabled={attributes.isLoading}
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
                        />
                        <Divider />
                        <ProductAttributesTable
                            error={attributes.error}
                            isLoading={attributes.isLoading}
                            onPageChange={(page) => setController({...controller, page:page-1})}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onSortChange={handleSortChange}
                            page={controller.page + 1}
                            data={attributes.data ? attributes.data : []}
                            pagesCount={attributes.paginationMeta ? attributes.paginationMeta.last_page : null}
                            elementsCount={attributes.data?.categoriesCount}
                            selectedElements={selectedElements}
                            sort={controller.sort}
                            sortBy={controller.sortBy}
                        />

                    </Card>
                </Container>
            </Box>
        </>
    )
}

export default ProductAttributes