import {Box, Card, Container, Divider} from "@material-ui/core";
import {Helmet} from "react-helmet-async";
import {useTranslation} from "react-i18next";
import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import ExportButton from "../../components/common/export-button";
import {ListFilter} from "../../components/common/filter/list-filter";
import {TrTypography} from "../../components/common/translated/translated-typography";
import {APIContext} from "../../contexts/api-context";
import {EmailClientContext} from "../../contexts/email-client-context";
import {AuthContext} from "../../contexts/oauth-context";
import {useMounted} from "../../hooks/use-mounted";
import {useCallback, useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../contexts/settings-context";
import {useSelection} from "../../hooks/use-selection";
import gtm from "../../lib/gtm";
import {getUrlFilters} from "../../utils/apply-filters";
import {UsersTable} from "./components/system-users-table";

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

export const SystemUsersList = () => {
  const mounted = useMounted();
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'created_at',
    view: 'all'
  });
  const [usersState, setUsersState] = useState({isLoading: true});
  const { t } = useTranslation();

  const {appName} = useContext(SettingsContext)
  const {can} = useContext(AuthContext)

  const [
    selectedElements,
    handleSelect,
    handleSelectAll,
  ] = useSelection();
  const {fetchUsers} = useContext(APIContext)

  const {
    setAddresses,
    setSubject,
    setInitialBody,
    showEmailClient
  } = useContext(EmailClientContext)[1]

  const setupEmailClient = (users) => {
    setInitialBody('<h1>Hello {{name}}</h1>')
    setAddresses(users.map(u => u.name+ ' <'+u.email+'>'))
    setSubject('Hello {{name}}')
    showEmailClient()
  }

  const getUsers = useCallback(async () => {
    setUsersState(() => ({isLoading: true}));

    try {
      const result = await fetchUsers({
        page: controller.page + 1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setUsersState(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setUsersState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getUsers().catch(console.error);
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
      return usersState.data.find(c => {
        return c.id === s
      })
    })
    setupEmailClient(customers)
  }

  return can('users.can.list') ? (
      <>
        <Helmet>
          <title>{t("Users")}: {t("List")} | {appName}</title>
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
                <TrTypography
                    color="textPrimary"
                    variant="h4"
                >
                  Users
                </TrTypography>
                <Box sx={{flexGrow: 1}}/>
                <ExportButton
                    name={"customers"}
                    modelsSimple={["Customer"]}
                    modelsExtended={["Customer", "Address", "Order", "Payment", "PaymentSource"]}
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
                  disabled={usersState.isLoading}
                  filters={controller.filters}
                  onFiltersApply={(data) => setController({...controller, ...data})}
                  onFiltersClear={(data) => setController({...controller, ...data})}
                  onQueryChange={handleQueryChange}
                  onViewChange={handleViewChange}
                  query={controller.query}
                  selectedElements={selectedElements}
                  view={controller.view}
                  filterProperties={filterProperties}
                  views={[]}
                  bulkMenuItems={[
                    {
                      name: 'Email selected',
                      callback: handleSendEmail
                    }
                  ]}
              />
              <Divider/>
              <UsersTable
                  customers={usersState.data ? usersState.data : []}
                  pagesCount={usersState.paginationMeta ? usersState.paginationMeta.last_page : null}
                  error={usersState.error}
                  isLoading={usersState.isLoading}
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
      </>
  ) : (<MissingPermission/>)
}
