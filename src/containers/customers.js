import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Box, Button, Card, Container, Divider, Typography} from '@material-ui/core';
import {CustomerDialog} from '../components/customer/customer-dialog';
import {CustomersTable} from '../components/customer/customers-table';
import {useMounted} from '../hooks/use-mounted';
import {useSelection} from '../hooks/use-selection';
import {Plus as PlusIcon} from '../icons/plus';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {ListFilter} from "../components/list-filter";
import {getUrlFilters} from "../utils/apply-filters";
import {SettingsContext} from "../contexts/settings-context";
import {EmailClientContext} from "../contexts/email-client-context";

const views = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Returning',
    value: 'returning'
  },
  {
    label: 'Ordered recently',
    value: 'ordered_recently'
  }
];

const filterProperties = [
  {
    label: 'Name',
    name: 'name',
    type: 'string'
  },
  {
    label: 'Phone',
    name: 'phone',
    type: 'string'
  },
  {
    label: 'Email',
    name: 'email',
    type: 'string'
  },
  {
    label: 'Created',
    name: 'created_at',
    type: 'date'
  }
];

export const Customers = () => {
  const mounted = useMounted();
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'created_at',
    view: 'all'
  });
  const [customersState, setCustomersState] = useState({isLoading: true});
  const [
    selectedElements,
    handleSelect,
    handleSelectAll,
    mergeSelectableRows
  ] = useSelection();
  const {fetchCustomers} = useContext(APIContext)
  const {language, appName} = useContext(SettingsContext)
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const {
    setAddresses,
    setSubject,
    setInitialBody,
    showEmailClient
  } = useContext(EmailClientContext)[1]

  useEffect(() => {
    if (customersState.data) {
      mergeSelectableRows(customersState.data)
    }
  }, [customersState])

  const setupEmailClient = (users) => {
    setInitialBody('<h1>Hello {{name}}</h1>')
    setAddresses(users.map(u => u.name+ ' <'+u.email+'>'))
    setSubject('Hello {{name}}')
    showEmailClient()
  }

  const getCustomers = useCallback(async () => {
    setCustomersState(() => ({isLoading: true}));

    try {
      const result = await fetchCustomers({
        page: controller.page + 1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setCustomersState(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setCustomersState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getCustomers().catch(console.error);
  }, [controller]);

  useEffect(() => {
    gtm.push({event: 'page_view'});
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
          property: 'name',
          value: newQuery,
          operator: "contains"
        }
      ]
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

  const handleSortChange = (event, property) => {
    const isAsc = controller.sortBy === property && controller.sort === 'asc';

    setController({
      ...controller,
      page: 0,
      sort: isAsc ? 'desc' : 'asc',
      sortBy: property
    });
  };

  const handleSendEmail = () => {
    const customers = selectedElements.map(s => {
      return customersState.data.find(c => {
        return c.id === s
      })
    })
    setupEmailClient(customers)
  }

  return (
    <>
      <Helmet>
        <title>Customer: List | {appName}</title>
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
          <Box sx={{py: 4}}>
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
                Customers
              </Typography>
              <Box sx={{flexGrow: 1}}/>
              <Button
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
                size="large"
                startIcon={<PlusIcon fontSize="small"/>}
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
              disabled={customersState.isLoading}
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
                  name: 'Email selected',
                  callback: handleSendEmail
                }
              ]}
            />
            <Divider/>
            <CustomersTable
              customers={customersState.data ? customersState.data : []}
              pagesCount={customersState.paginationMeta ? customersState.paginationMeta.last_page : null}
              error={customersState.error}
              isLoading={customersState.isLoading}
              onPageChange={handlePageChange}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              page={controller.page + 1}
              selectedCustomers={selectedElements}
              sort={controller.sort}
              sortBy={controller.sortBy}
            />
          </Card>
        </Container>
      </Box>
      <CustomerDialog
        onClose={() => setOpenCreateDialog(false)}
        open={openCreateDialog}
      />
    </>
  );
};
