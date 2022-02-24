import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Container, Divider, Typography } from '@material-ui/core';
import { useMounted } from '../hooks/use-mounted';
import { useSelection } from '../hooks/use-selection';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {SettingsContext} from "../contexts/settings-context";
import {ListFilter} from "../components/list-filter";
import {getUrlFilters} from "../utils/apply-filters";
import {OrdersTable} from "../components/order/orders-table";
import {OrdersDnd} from "../components/order/orders-dnd";

const views = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Paid',
    value: 'paid'
  },
  {
    label: 'Processing',
    value: 'processing'
  },
  {
    label: 'In Transit',
    value: 'in_transit'
  },
  {
    label: 'Completed',
    value: 'completed'
  },
  {
    label: 'On Hold',
    value: 'on_hold'
  },
  {
    label: 'Cancelled',
    value: 'cancelled'
  }
];

const filterProperties = [
  {
    label: 'Price',
    name: 'total_price',
    type: 'number'
  },
  {
    label: 'Description',
    name: 'description',
    type: 'string'
  },
  {
    label: 'User',
    name: 'user.name',
    type: 'string'
  }
];

export const Orders = () => {
  const mounted = useMounted();
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'orders.updated_at',
    view: 'all',
    search: ''
  });
  const {language, appName} = useContext(SettingsContext)
  const [dataState, setDataState] = useState({ isLoading: true });
  const [
    selectedElements,
    handleSelect,
    handleSelectAll,
    mergeSelectableRows
  ] = useSelection();
  const [mode, setMode] = useState('dnd');
  const {fetchOrders} = useContext(APIContext)

  useEffect(() => {
    if (dataState.data) {
      mergeSelectableRows(dataState.data)
    }
  }, [dataState])

  const fetchData = useCallback(async () => {
    setDataState(() => ({ isLoading: true }));

    try {
      const result = await fetchOrders({
        page: controller.page + 1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view,
        search: controller.search
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

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
    }
  };

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
      search: newQuery
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
        <title>Orders | {appName}</title>
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
                Orders
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

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
              onModeChange={handleModeChange}
              onQueryChange={handleQueryChange}
              onViewChange={handleViewChange}
              query={controller.query}
              selectedElements={selectedElements}
              mode={mode}
              view={controller.view}
              filterProperties={filterProperties}
              views={views}
            />
            <Divider />
            {mode === 'table'
              ? (
            <OrdersTable
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
            />) : (<OrdersDnd
                error={dataState.error}
                isLoading={dataState.isLoading}
                orders={dataState.data}
              />)}
          </Card>
        </Container>
      </Box>
    </>
  );
};
