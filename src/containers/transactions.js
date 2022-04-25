import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@material-ui/core';
import { useMounted } from '../hooks/use-mounted';
import { useSelection } from '../hooks/use-selection';
import { Plus as PlusIcon } from '../icons/plus';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {SettingsContext} from "../contexts/settings-context";
import {ListFilter} from "../components/list-filter";
import {getUrlFilters} from "../utils/apply-filters";
import {TransactionsTable} from "../components/transactions/transactions-table";
import {DialogContext} from "../contexts/dialog-context";
import ExportButton from "../components/export-button";

const views = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Payments',
        value: 'payment'
    },
    {
        label: 'Refunds',
        value: 'refund'
    }
];

const filterProperties = [
    {
        label: 'Value',
        name: 'amount',
        type: 'number'
    },
    {
        label: 'Processed At',
        name: 'created_at',
        type: 'date'
    }
];

export const Transactions = () => {
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

    const { fetchPayments, bulkUpdatePaymentStatuses } = useContext(APIContext)

    useEffect(() => {
        if (dataState.data) {
            mergeSelectableRows(dataState.data)
        }
    }, [dataState])

    const fetchData = useCallback(async () => {
        setDataState(() => ({ isLoading: true }));

        try {
            const result = await fetchPayments({
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

    const doBulkUpdateOrderStatuses = useCallback( async (ids, status) => {
        try {
            return await bulkUpdatePaymentStatuses({
                ids: ids,
                status: status
            });
        } catch (err) {
            console.error(err);
        }
    }, [])

    const handleBulkStatusUpdate = (status) => {
        const call = () => doBulkUpdateOrderStatuses(selectedElements, status).then(result => {
            if (result.data?.status === "Success") {
                clearSelected()
                fetchData().catch(console.error)
            }
        })

        setCallback({method: call})
        setTitle('Are you sure?')
        setDescription('You are about to update the status of multiple transactions.')
        showGenericDialog(true)
    }

    return (
      <>
          <Helmet>
              <title>Transactions | {appName}</title>
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
                              Transactions
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
                            name={"transactions"}
                            modelsSimple={["Payment"]}
                            modelsExtended={["Payment", "User", "PaymentSource"]}
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
                                name: 'Mark as pending',
                                callback: () => handleBulkStatusUpdate(0)
                            },
                            {
                                name: 'Mark as settled',
                                callback: () => handleBulkStatusUpdate(1)
                            },
                            {
                                name: 'Mark as refunded',
                                callback: () => handleBulkStatusUpdate(2)
                            },
                            {
                                name: 'Mark as in rejected',
                                callback: () => handleBulkStatusUpdate(3)
                            }
                        ]}
                      />
                      <Divider />
                      <TransactionsTable
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
          {/*<ProductCreateDialog*/}
          {/*  onClose={() => setOpenCreateDialog(false)}*/}
          {/*  open={openCreateDialog}*/}
          {/*/>*/}
      </>
    );
};
