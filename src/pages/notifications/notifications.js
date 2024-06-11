import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import {Box, Card, Container, Divider} from '@material-ui/core';
import { useMounted } from '../../hooks/use-mounted';
import {SettingsContext} from "../../contexts/settings-context";
import {ListFilter} from "../../components/common/filter/list-filter";
import {useSelection} from "../../hooks/use-selection";
import {getUrlFilters} from "../../utils/apply-filters";
import {APIContext} from "../../contexts/api-context";
import NotificationsTable from "../../components/common-page-components/notifications/notifications-table";
import {NotificationsContext} from "../../contexts/notifications-context";
import {TrTypography} from "../../components/common/translated/translated-typography";

const filterProperties = [
  {
    label: 'Message',
    name: 'data->message',
    type: 'string'
  },
  {
    label: 'Created At',
    name: 'created_at',
    type: 'date'
  }
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState({isLoading: true})
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const {fetchNotifications} = useContext(APIContext)
  const {notificationTypes} = useContext(NotificationsContext)[0]
  const views = [{
    label: 'All',
    value: 'all'
  }, ...Object.keys(notificationTypes).map((key) => {
    return {
      label: notificationTypes[key].title,
      value: key
    }
  })]

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
  ] = useSelection();

  const getNotifications = useCallback(async () => {
    setNotifications(() => ({ isLoading: true }));

    try {
      const result = await fetchNotifications({
        page: controller.page+1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setNotifications(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setNotifications(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getNotifications().catch(console.error);
  }, [controller]);

  const handleQueryChange = (newQuery) => {
    setController({
      ...controller,
      page: 0,
      filters: [{
        property: 'data->message',
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


  return (
    <>
      <Helmet>
        <title>Reports | {appName}</title>
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
                Notifications
              </TrTypography>
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
              disabled={notifications.isLoading}
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
              bulkMenuItems={[]}
            />
            <Divider />
            <NotificationsTable
              error={notifications.error}
              isLoading={notifications.isLoading}
              onPageChange={(page) => setController({...controller, page:page-1})}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              page={controller.page + 1}
              data={notifications.data ? notifications.data : []}
              pagesCount={notifications.paginationMeta ? notifications.paginationMeta.last_page : null}
              elementsCount={notifications.data?.categoriesCount}
              selectedElements={selectedElements}
              sort={controller.sort}
              sortBy={controller.sortBy}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};
