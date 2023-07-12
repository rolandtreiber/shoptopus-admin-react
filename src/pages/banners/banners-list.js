import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@material-ui/core';
import { useMounted } from '../../hooks/use-mounted';
import { useSelection } from '../../hooks/use-selection';
import { Plus as PlusIcon } from '../../icons/plus';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {SettingsContext} from "../../contexts/settings-context";
import {ListFilter} from "../../components/common/filter/list-filter";
import {getUrlFilters} from "../../utils/apply-filters";
import {BannersTable} from "../../components/page-components/banners/banners-table";
import {BannerCreateDialog} from "../../components/page-components/banners/banner-create-dialog";
import {DialogContext} from "../../contexts/dialog-context";

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

const filterProperties = [
    {
        label: 'Title',
        name: 'title',
        type: 'string'
    },
    {
        label: 'Description',
        name: 'description',
        type: 'string'
    }
];

export const BannersList = () => {
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });
    const {appName} = useContext(SettingsContext)
    const [dataState, setDataState] = useState({ isLoading: true });
    const [
        selectedElements,
        handleSelect,
        handleSelectAll,
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

    const {
        fetchBanners,
        bulkDeleteBanners,
        bulkUpdateBannersAvailabilities
    } = useContext(APIContext)

    useEffect(() => {
        if (dataState.data) {
            mergeSelectableRows(dataState.data)
        }
    }, [dataState])

    const fetchData = useCallback(async () => {
        setDataState(() => ({ isLoading: true }));

        try {
            const result = await fetchBanners({
                page: controller.page + 1,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: getUrlFilters(controller.filters),
                view: controller.view
            })

            if (mounted.current) {
                setDataState(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setDataState(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        fetchData().catch(console.error);
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
            page: 0,
            filters: [
                {
                    property: 'description',
                    value: newQuery,
                    operator: "contains"
                }
            ]
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

    const doBulkUpdateAvailability = useCallback( async (ids, availability) => {
        try {
            return await bulkUpdateBannersAvailabilities({
                availability: availability,
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkDelete = useCallback( async (ids) => {
        try {
            return await bulkDeleteBanners({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const handleBulkAvailabilityUpdate = (available) => {
        const call = () => doBulkUpdateAvailability(selectedElements, available).then(result => {
            if (result?.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error);
            }
        })

        const newStatus = available ? 'enabled' : 'disabled'

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to set the selected banners '+newStatus+'.')
        showGenericDialog(true)
    }

    const handleBulkDelete = () => {
        const call = () => doBulkDelete(selectedElements).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to delete the selected banners.')
        showGenericDialog(true)
    }

    return (
      <>
          <Helmet>
              <title>Banners | {appName}</title>
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
                              Banners
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
                        disabled={dataState.isLoading}
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
                      <BannersTable
                        error={dataState.error}
                        isLoading={dataState.isLoading}
                        onPageChange={handlePageChange}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                        onReload={() => fetchData().catch(console.error)}
                        onSortChange={handleSortChange}
                        page={controller.page + 1}
                        data={dataState.data ? dataState.data : []}
                        pagesCount={dataState.paginationMeta ? dataState.paginationMeta.last_page : null}
                        selectedElements={selectedElements}
                        sort={controller.sort}
                        sortBy={controller.sortBy}
                      />
                  </Card>
              </Container>
          </Box>
          <BannerCreateDialog
            onClose={() => setOpenCreateDialog(false)}
            open={openCreateDialog}
            onSuccess={() => fetchData().catch(console.error)}
          />
      </>
    );
};
