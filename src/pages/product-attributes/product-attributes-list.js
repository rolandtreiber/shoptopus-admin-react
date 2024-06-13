import {useCallback, useContext, useEffect, useState} from 'react'
import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import TrButton from "../../components/common/translated/translated-button";
import {AuthContext} from "../../contexts/oauth-context";
import {useMounted} from "../../hooks/use-mounted";
import {useSelection} from "../../hooks/use-selection";
import {APIContext} from "../../contexts/api-context";
import {Box, Card, Container, Divider} from "@material-ui/core";
import {Plus as PlusIcon} from "../../icons/plus";
import ProductAttributesTable from "./components/product-attributes-table";
import {SettingsContext} from "../../contexts/settings-context";
import {getUrlFilters} from "../../utils/apply-filters";
import {Helmet} from "react-helmet-async";
import {ListFilter} from "../../components/common/filter/list-filter";
import {ProductAttributeCreateDialog} from "./components/product-attribute-create-dialog";
import {DialogContext} from "../../contexts/dialog-context";
import ExportButton from "../../components/common/export-button";
import {useTranslation} from "react-i18next";
import {TrTypography} from "../../components/common/translated/translated-typography";

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

export const ProductAttributesList = () => {
    const [attributes, setAttributes] = useState({isLoading: true})
    const mounted = useMounted();
    const {can} = useContext(AuthContext)
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
            mergeSelectableRows,
        clearSelected
    ] = useSelection();
    const {appName, language} = useContext(SettingsContext)

    const {
        setCallback,
        setTitle,
        showGenericDialog,
        setDescription
    } = useContext(DialogContext)[1]
    const { t } = useTranslation();

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductAttributes,
        bulkDeleteProductAttributes,
        bulkUpdateProductAttributesAvailability} = useContext(APIContext)

    useEffect(() => {
        if (attributes.data) {
            mergeSelectableRows(attributes.data)
        }
    }, [attributes])

    const getAttributes = useCallback(async (clearWhileLoading = true) => {
        clearWhileLoading && setAttributes(() => ({ isLoading: true }));

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
            return await bulkUpdateProductAttributesAvailability({
                availability: availability,
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkDelete = useCallback( async (ids) => {
        try {
            return await bulkDeleteProductAttributes({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const handleBulkAvailabilityUpdate = (available) => {
        const call = () => doBulkUpdateAvailability(selectedElements, available).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                getAttributes().catch(console.error);
            }
        })

        const newStatus = available ? 'enabled' : 'disabled'

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to set the selected product attributes '+newStatus+'.')
        showGenericDialog(true)
    }

    const handleBulkDelete = () => {
        const call = () => doBulkDelete(selectedElements).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                getAttributes().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to delete the selected product attributes.')
        showGenericDialog(true)
    }

    return can('product.attributes.can.list') ? (
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
                            <TrTypography
                                color="textPrimary"
                                variant="h4"
                            >
                                Product Attributes
                            </TrTypography>
                            <Box sx={{ flexGrow: 1 }} />
                            <TrButton
                                color="primary"
                                onClick={() => setOpenCreateDialog(true)}
                                size="large"
                                startIcon={<PlusIcon fontSize="small" />}
                                variant="contained"
                            >
                                Add
                            </TrButton>
                            <ExportButton
                              name={"product-attributes"}
                              modelsSimple={["ProductAttribute"]}
                              modelsExtended={["ProductAttribute", "ProductAttributeOption"]}
                              showTemplate={false}
                            />
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
                            onReload={() => getAttributes(false)}
                        />

                    </Card>
                </Container>
            </Box>
            <ProductAttributeCreateDialog
              onClose={() => setOpenCreateDialog(false)}
              open={openCreateDialog}
              onSuccess={() => getAttributes().catch(console.error)}
            />
        </>
    ) : (<MissingPermission/>)
}