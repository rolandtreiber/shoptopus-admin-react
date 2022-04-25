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
import {DialogContext} from "../contexts/dialog-context";
import ExportButton from "../components/export-button";

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

    const {fetchVoucherCodes,
        bulkDeleteVoucherCodes,
        bulkExpireVoucherCodes,
        bulkStartVoucherCodes,
        bulkActivateVoucherCodesForPeriod} = useContext(APIContext)

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

    const doBulkDelete = useCallback( async (ids) => {
        try {
            return await bulkDeleteVoucherCodes({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkExpire = useCallback( async (ids) => {
        try {
            return await bulkExpireVoucherCodes({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkStart = useCallback( async (ids) => {
        try {
            return await bulkStartVoucherCodes({
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const doBulkMakeActive = useCallback( async (ids, length) => {
        try {
            return await bulkActivateVoucherCodesForPeriod({
                period: length,
                ids: ids,
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const handleBulkExpire = () => {
        const call = () => doBulkExpire(selectedElements).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to set the selected voucher codes expired.')
        showGenericDialog(true)
    }

    const handleBulkStart = () => {
        const call = () => doBulkStart(selectedElements).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to set the start date and time to now on the selected voucher codes.')
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
        setDescription('You are about to delete the selected voucher codes.')
        showGenericDialog(true)
    }

    const handleBulkMakeActive = (length) => {
        let message = '';
        switch (length) {
            case 0:
                message = 'You are about to set the selected voucher codes active for one day starting now.'
                break
            case 1:
                message = 'You are about to set the selected voucher codes active for one week starting now.'
                break
            case 2:
                message = 'You are about to set the selected voucher codes active for one month starting now.'
        }

        const call = () => doBulkMakeActive(selectedElements, length).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error);
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription(message)
        showGenericDialog(true)
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
                            <ExportButton
                              name={"voucher-codes"}
                              modelsSimple={["VoucherCode"]}
                              modelsExtended={["VoucherCode", "Order"]}
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
                                  callback: () => handleBulkMakeActive(0)
                              },
                              {
                                  name: 'Make active for a week from now',
                                  callback: () => handleBulkMakeActive(1)
                              },
                              {
                                  name: 'Make active for a month from now',
                                  callback: () => handleBulkMakeActive(2)
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
