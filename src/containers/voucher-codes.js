import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@material-ui/core';
import { VoucherCodeCreateDialog } from '../components/voucher-codes/voucher-code-create-dialog';
import { VoucherCodesTable } from '../components/voucher-codes/voucher-codes-table';
import { useMounted } from '../hooks/use-mounted';
import { useSelection } from '../hooks/use-selection';
import { Plus as PlusIcon } from '../icons/plus';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {SettingsContext} from "../contexts/settings-context";
import {ListFilter} from "../components/list-filter";
import {getUrlFilters} from "../utils/apply-filters";

const views = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Active',
        value: 'active'
    },
    {
        label: 'Not Started',
        value: 'not_started'
    },
    {
        label: 'Expired',
        value: 'expired'
    },
    {
        label: 'All Inactive',
        value: 'all_inactive'
    }
];

const filterProperties = [
    {
        label: 'Code',
        name: 'code',
        type: 'string'
    },
    {
        label: 'Valid From',
        name: 'valid_from',
        type: 'date'
    },
    {
        label: 'Valid Until',
        name: 'valid_until',
        type: 'date'
    }
];

export const VoucherCodes = () => {
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
    const [dataState, setDataState] = useState({ isLoading: true });
    const [
        selectedElements,
        handleSelect,
        handleSelectAll,
        mergeSelectableRows
    ] = useSelection();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchVoucherCodes} = useContext(APIContext)

    useEffect(() => {
        if (dataState.data) {
            mergeSelectableRows(dataState.data)
        }
    }, [dataState])

    const fetchData = useCallback(async () => {
        setDataState(() => ({ isLoading: true }));

        try {
            const result = await fetchVoucherCodes({
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
                    property: 'code',
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

    const handleBulkExpire = () => {
        console.log('All selected expired')
    }

    const handleBulkStart = () => {
        console.log('All selected started')
    }

    const handleBulkDelete = () => {
        console.log('All selected deleted')
    }

    const handleBulkMakeActive = (length) => {
        switch (length) {
            case 'day':
                console.log('All selected made active for 1 day')
                break
            case 'week':
                console.log('All selected made active for 1 week')
                break
            case 'month':
                console.log('All selected made active for 1 month')
                break
        }
    }

    return (
        <>
            <Helmet>
                <title>Voucher Codes | {appName}</title>
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
                                Voucher Codes
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
                                  name: 'Expire',
                                  callback: () => handleBulkExpire()
                              },
                              {
                                  name: 'Start now',
                                  callback: () => handleBulkStart(false)
                              },
                              {
                                  name: 'Make active for a day from now',
                                  callback: () => handleBulkMakeActive('day')
                              },
                              {
                                  name: 'Make active for a week from now',
                                  callback: () => handleBulkMakeActive('week')
                              },
                              {
                                  name: 'Make active for a month from now',
                                  callback: () => handleBulkMakeActive('month')
                              },
                              {
                                  name: 'Delete',
                                  callback: () => handleBulkDelete()
                              }
                          ]}
                        />
                        <Divider />
                        <VoucherCodesTable
                            error={dataState.error}
                            isLoading={dataState.isLoading}
                            onPageChange={handlePageChange}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
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
            <VoucherCodeCreateDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
                onSuccess={() => fetchData().catch(console.error)}
            />
        </>
    );
};
