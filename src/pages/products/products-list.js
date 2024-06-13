import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Container, Divider } from '@material-ui/core';
import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import TrButton from "../../components/common/translated/translated-button";
import { ProductDialog } from './components/product-dialog';
import { ProductsSummary } from './components/products-summary';
import { ProductsTable } from './components/products-table';
import { useMounted } from '../../hooks/use-mounted';
import { useSelection } from '../../hooks/use-selection';
import { Plus as PlusIcon } from '../../icons/plus';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {SettingsContext} from "../../contexts/settings-context";
import {getUrlFilters} from "../../utils/apply-filters";
import {ListFilter} from "../../components/common/filter/list-filter";
import {DialogContext} from "../../contexts/dialog-context";
import ExportButton from "../../components/common/export-button";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../contexts/oauth-context";
import {TrTypography} from "../../components/common/translated/translated-typography";

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
    label: 'Provisional',
    value: 'provisional'
  },
  {
    label: 'Discontinued',
    value: 'discontinued'
  }
];

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
  },
  {
    label: 'Status',
    name: 'status',
    type: 'string'
  },
  {
    label: 'Original Price',
    name: 'price',
    type: 'number'
  },
  {
    label: 'Virtual',
    name: 'virtual',
    type: 'boolean'
  }
];

export const ProductsList = () => {
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
  const [productsState, setProductsState] = useState({ isLoading: true });
  const [
    selectedProducts,
    handleSelect,
    handleSelectAll,
    mergeSelectableRows,
    clearSelected
  ] = useSelection();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]
  const {language} = useContext(SettingsContext)
  const { t } = useTranslation();
  const {can} = useContext(AuthContext)
  
  const {fetchProducts, bulkDeleteProducts, bulkArchiveProducts} = useContext(APIContext)

  useEffect(() => {
    if (productsState.data) {
      mergeSelectableRows(productsState.data)
    }
  }, [productsState])

  const getProducts = useCallback(async () => {
    setProductsState(() => ({ isLoading: true }));

    try {
      const result = await fetchProducts({
        page: controller.page+1,
        paginate: 20,
        sort_by_type: controller.sort,
        sort_by_field: controller.sortBy,
        filters: getUrlFilters(controller.filters),
        view: controller.view
      })

      if (mounted.current) {
        setProductsState(() => ({
          isLoading: false,
          data: result.data.data,
          paginationMeta: result.data.meta
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setProductsState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller]);

  useEffect(() => {
    getProducts().catch(console.error);
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
          property: 'name->'+language,
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

  const doBulkArchive = useCallback( async (ids) => {
    try {
      return await bulkArchiveProducts({
        ids: ids,
      });
    } catch (err) {
      console.error(err);
    }
  }, [])

  const doBulkDelete = useCallback( async (ids) => {
    try {
      return await bulkDeleteProducts({
        ids: ids,
      });
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleBulkArchive = () => {
    const call = () => doBulkArchive(selectedProducts).then(result => {
      if (result.data?.status === "Success") {
        clearSelected()
        getProducts().catch(console.error);
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to archive multiple products.')
    showGenericDialog(true)
  };

  const handleBulkDelete = () => {
    const call = () => doBulkDelete(selectedProducts).then(result => {
      if (result.data?.status === "Success") {
        clearSelected()
        getProducts().catch(console.error);
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete multiple products.')
    showGenericDialog(true)
  };

  return can('products.can.list') ? (
    <>
      <Helmet>
        <title>Product: List | {appName}</title>
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
                Products
              </TrTypography>
              <Box sx={{ flexGrow: 1 }} />
              <TrButton
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
                size="large"
                disabled={!can("products.can.create")}
                startIcon={<PlusIcon fontSize="small" />}
                variant="contained"
              >
                Add
              </TrButton>
              <ExportButton
                name={"products"}
                modelsSimple={["Product"]}
                modelsExtended={["Product", "ProductVariant", "ProductCategory", "ProductAttribute", "ProductTag"]}
                modelTemplate={"Product"}
                showTemplate={true}
              />
            </Box>
          </Box>
          <ProductsSummary />
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
            <ListFilter
              disabled={productsState.isLoading}
              filters={controller.filters}
              onFiltersApply={(data) => setController({...controller, ...data})}
              onFiltersClear={(data) => setController({...controller, ...data})}
              onQueryChange={handleQueryChange}
              onViewChange={handleViewChange}
              query={controller.query}
              selectedElements={selectedProducts}
              view={controller.view}
              filterProperties={filterProperties}
              views={views}
              bulkMenuItems={[
                {
                  name: 'Archive selected',
                  callback: handleBulkArchive
                },
                {
                  name: 'Delete selected',
                  callback: handleBulkDelete,
                  disabled: !can("products.can.delete")
              }
              ]}
            />
            <Divider />
            <ProductsTable
              error={productsState.error}
              isLoading={productsState.isLoading}
              onPageChange={handlePageChange}
              onReload={() => getProducts().catch(console.error)}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              page={controller.page + 1}
              products={productsState.data ? productsState.data : []}
              pagesCount={productsState.paginationMeta ? productsState.paginationMeta.last_page : null}
              productsCount={productsState.data?.productsCount}
              selectedProducts={selectedProducts}
              sort={controller.sort}
              sortBy={controller.sortBy}
            />
          </Card>
        </Container>
      </Box>
      <ProductDialog
        onClose={() => setOpenCreateDialog(false)}
        open={openCreateDialog}
        onSuccess={() => getProducts().catch(console.error)}
      />
    </>
  ) : (<MissingPermission/>);
};
