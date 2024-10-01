import {Suspense, lazy} from 'react';
import {AuthGuard} from './components/common/guards/auth-guard';
import {GuestGuard} from './components/common/guards/guest-guard';
import {CustomerSingle} from './pages/customers/customer-single';
import {LoadingScreen} from './components/common-page-components/layout-elements/loading-screen';
import {Account} from './pages/account/account';
import {DashboardLayout} from './pages/dashboard/dashboard-layout';
import {ProductSingle} from './pages/products/product-single';
import {Dashboard} from './pages/dashboard/dashboard';
import {DashboardOverview} from "./pages/dashboard/dashboard-overview";
import {DashboardSales} from "./pages/dashboard/dashboard-sales";

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen/>}>
    <Component {...props} />
  </Suspense>
);
Loadable.displayName = "Loadable"

// Not found pages
const NotFound = Loadable(lazy(() => import('./pages/404/not-found').then((module) => ({default: module.NotFound}))));

// Auth pages
const Login = Loadable(lazy(() => import('./pages/auth/login').then((module) => ({default: module.Login}))));
const PasswordRecovery = Loadable(lazy(() => import('./pages/auth/password-recovery').then((module) => ({default: module.PasswordRecovery}))));
const PasswordReset = Loadable(lazy(() => import('./pages/auth/password-reset').then((module) => ({default: module.PasswordReset}))));

// Import
const ImportData = Loadable(lazy(() => import('./pages/import/import').then((module) => ({default: module.Import}))));

const Customers = Loadable(lazy(() => import('./pages/customers/customers-list').then((module) => ({default: module.CustomersList}))));
const CustomerActivity = Loadable(lazy(() => import('./pages/customers/customer-activity').then((module) => ({default: module.CustomerActivity}))));
const CustomerOrders = Loadable(lazy(() => import('./pages/customers/customer-orders').then((module) => ({default: module.CustomerOrders}))));
const CustomerSummary = Loadable(lazy(() => import('./pages/customers/customer-summary').then((module) => ({default: module.CustomerSummary}))));

const Order = Loadable(lazy(() => import('./pages/orders/order-single').then((module) => ({default: module.OrderSingle}))));
const Orders = Loadable(lazy(() => import('./pages/orders/orders-list').then((module) => ({default: module.OrdersList}))));

const Invoices = Loadable(lazy(() => import('./pages/invoices/invoices').then((module) => ({default: module.Invoices}))));
const InvoiceCreate = Loadable(lazy(() => import('./pages/invoices/invoice-create').then((module) => ({default: module.InvoiceCreate}))));
const InvoiceSummary = Loadable(lazy(() => import('./pages/invoices/invoice').then((module) => ({default: module.Invoice}))));
const InvoicePreview = Loadable(lazy(() => import('./pages/invoices/invoice-preview').then((module) => ({default: module.InvoicePreview}))));

const Products = Loadable(lazy(() => import('./pages/products/products-list').then((module) => ({default: module.ProductsList}))));
const ProductAnalytics = Loadable(lazy(() => import('./pages/account/product-analytics').then((module) => ({default: module.ProductAnalytics}))));
const ProductInventory = Loadable(lazy(() => import('./pages/products/product-inventory').then((module) => ({default: module.ProductInventory}))));
const ProductVariants = Loadable(lazy(() => import('./pages/products/partials/product-variants').then((module) => ({default: module.ProductVariants}))));
const ProductRatings = Loadable(lazy(() => import('./pages/products/partials/product-ratings').then((module) => ({default: module.ProductRatings}))));
const ProductInsights = Loadable(lazy(() => import('./pages/products/partials/product-insights').then((module) => ({default: module.ProductInsights}))));
const ProductPaidFiles = Loadable(lazy(() => import('./pages/products/partials/product-paid-files').then((module) => ({default: module.default}))));
const ProductFiles = Loadable(lazy(() => import('./pages/products/partials/product-files').then((module) => ({default: module.default}))));
const ProductSummary = Loadable(lazy(() => import('./pages/products/partials/product-summary').then((module) => ({default: module.ProductSummary}))));
const ProductPreview = Loadable(lazy(() => import('./pages/products/partials/product-preview').then((module) => ({default: module.ProductPreview}))));

const AccountGeneral = Loadable(lazy(() => import('./pages/account/account-general').then((module) => ({default: module.AccountGeneral}))));
const AccountNotifications = Loadable(lazy(() => import('./pages/account/account-notifications').then((module) => ({default: module.AccountNotifications}))));

const ProductCategories = Loadable(lazy(() => import('./pages/product-categories/product-categories-list').then((module) => ({default: module.ProductCategoriesList}))));
const ProductAttributes = Loadable(lazy(() => import('./pages/product-attributes/product-attributes-list').then((module) => ({default: module.ProductAttributesList}))));
const ProductTags = Loadable(lazy(() => import('./pages/product-tags/product-tags-list').then((module) => ({default: module.default}))));

const ProductCategorySummary = Loadable(lazy(() => import('./pages/product-categories/product-category-single').then((module) => ({default: module.ProductCategorySingle}))));
const ProductAttributeSummary = Loadable(lazy(() => import('./pages/product-attributes/product-attribute-single').then((module) => ({default: module.ProductAttributeSingle}))));
const ProductTagSummary = Loadable(lazy(() => import('./pages/product-tags/product-tag-single').then((module) => ({default: module.ProductTagSingle}))));

const VoucherCodes = Loadable(lazy(() => import('./pages/voucher-codes/voucher-codes-list').then((module) => ({default: module.VoucherCodesList}))));
const VoucherCode = Loadable(lazy(() => import('./pages/voucher-codes/voucher-code-single').then((module) => ({default: module.VoucherCodeSingle}))));


const DiscountRules = Loadable(lazy(() => import('./pages/discount-rules/discount-rules-list').then((module) => ({default: module.DiscountRulesList}))));
const DiscountRule = Loadable(lazy(() => import('./pages/discount-rules/discount-rule-single').then((module) => ({default: module.DiscountRuleSingle}))));

const DeliveryTypes = Loadable(lazy(() => import('./pages/delivery-types/delivery-types-list').then((module) => ({default: module.DeliveryTypesList}))));
const DeliveryType = Loadable(lazy(() => import('./pages/delivery-types/delivery-type-single').then((module) => ({default: module.DeliveryTypeSingle}))));

const Transactions = Loadable(lazy(() => import('./pages/transactions/transactions-list').then((module) => ({default: module.TransactionsList}))));
const Transaction = Loadable(lazy(() => import('./pages/transactions/transaction-single').then((module) => ({default: module.TransactionSingle}))));

const Ratings = Loadable(lazy(() => import('./pages/ratings/ratings-list').then((module) => ({default: module.RatingsList}))));
const Rating = Loadable(lazy(() => import('./pages/ratings/rating-single').then((module) => ({default: module.RatingSingle}))));

const Banners = Loadable(lazy(() => import('./pages/banners/banners-list').then((module) => ({default: module.BannersList}))));
const Banner = Loadable(lazy(() => import('./pages/banners/banner-single').then((module) => ({default: module.BannerSingle}))));

const Files = Loadable(lazy(() => import('./pages/files/files-list').then((module) => ({default: module.FilesList}))));
const FileContent = Loadable(lazy(() => import('./pages/files/file-single').then((module) => ({default: module.FileContent}))));

const Reports = Loadable(lazy(() => import('./pages/reports/reports').then((module) => ({default: module.Reports}))));
const Notifications = Loadable(lazy(() => import('./pages/notifications/notifications').then((module) => ({default: module.Notifications}))));

const RolesAndPermissions = Loadable(lazy(() => import('./pages/roles-and-permissions/roles-and-permissions').then((module) => ({default: module.RolesAndPermissions}))));
const RoleTab = Loadable(lazy(() => import('./pages/roles-and-permissions/role-tab').then((module) => ({default: module.RoleTab}))));
const RolesAndPermissionsGeneralInformationTab = Loadable(lazy(() => import('./pages/roles-and-permissions/roles-and-permissions-general-information-tab').then((module) => ({default: module.RolesAndPermissionsGeneralInformationTab}))));
const SystemUsersList = Loadable(lazy(() => import('./pages/system-users/system-users-list').then((module) => ({default: module.SystemUsersList}))));

const routes = [
  {
    path: '/',
    element: (
      <GuestGuard>
        <Login/>
      </GuestGuard>
    )
  },
  {
    path: '/admin/',
    element: (
      <GuestGuard>
        <Login/>
      </GuestGuard>
    )
  },
  {
    path: '/admin/login',
    element: (
      <GuestGuard>
        <Login/>
      </GuestGuard>
    )
  },
  {
    path: '/admin/password-recovery',
    element: (
      <GuestGuard>
        <PasswordRecovery/>
      </GuestGuard>
    )
  },
  {
    path: '/admin/reset-password',
    element: (
      <PasswordReset/>
    )
  },
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <DashboardLayout/>
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard/>,
        children: [
          {
            path: '/admin/dashboard',
            element: <DashboardOverview/>
          },
          {
            path: '/admin/dashboard/sales',
            element: <DashboardSales/>
          }
        ]
      },
      {
        path: '/admin/delivery-types',
        children: [
          {
            path: '/admin/delivery-types',
            element: <DeliveryTypes/>
          },
          {
            path: '/admin/delivery-types/:deliveryTypeId',
            element: <DeliveryType/>
          }
        ]
      },
      {
        path: '/admin/transactions',
        children: [
          {
            path: '/admin/transactions/',
            element: <Transactions/>
          },
          {
            path: '/admin/transactions/:transactionId',
            element: <Transaction/>
          }
        ]
      },
      {
        path: '/admin/ratings',
        children: [
          {
            path: '/admin/ratings',
            element: <Ratings/>
          },
          {
            path: '/admin/ratings/:ratingId',
            element: <Rating/>
          }
        ]
      },
      {
        path: '/admin/content',
        children: [
          {
            path: '/admin/content/banners',
            children: [
              {
                path: '/admin/content/banners',
                element: <Banners/>
              },
              {
                path: '/admin/content/banners/:bannerId',
                element: <Banner/>
              }
            ]
          },
          {
            path: '/admin/content/files',
            children: [
              {
                path: '/admin/content/files',
                element: <Files/>
              },
              {
                path: '/admin/content/files/:fileId',
                element: <FileContent/>
              }
            ]
          }
        ]
      },
      {
        path: '/admin/account',
        element: <Account/>,
        children: [
          {
            path: '/admin/account',
            element: <AccountGeneral/>
          },
          {
            path: '/admin/account/notifications',
            element: <AccountNotifications/>
          },
        ]
      },
      {
        path: '/admin/customers',
        children: [
          {
            path: '/admin/customers',
            element: <Customers/>
          },
          {
            path: '/admin/customers/:customerId',
            element: <CustomerSingle/>,
            children: [
              {
                path: '/admin/customers/:customerId',
                element: <CustomerSummary/>
              },
              {
                path: '/admin/customers/:customerId/activity',
                element: <CustomerActivity/>
              },
              {
                path: '/admin/customers/:customerId/orders',
                element: <CustomerOrders/>
              }
            ]
          }
        ]
      },
      {
        path: '/admin/orders',
        children: [
          {
            path: '/admin/orders',
            element: <Orders/>
          },
          {
            path: '/admin/orders/:orderId',
            element: <Order/>
          }
        ]
      },
      {
        path: '/admin/discount',
        children: [
          {
            path: '/admin/discount/voucher-codes',
            children: [
              {
                path: '/admin/discount/voucher-codes',
                element: <VoucherCodes/>
              },
              {
                path: '/admin/discount/voucher-codes/:voucherCodeId',
                element: <VoucherCode/>
              }
            ]
          },
          {
            path: '/admin/discount/rules',
            children: [
              {
                path: '/admin/discount/rules',
                element: <DiscountRules/>
              },
              {
                path: '/admin/discount/rules/:discountRuleId',
                element: <DiscountRule/>
              }
            ]
          },
        ]
      },
      {
        path: '/admin/products',
        children: [
          {
            path: '/admin/products',
            element: <Products/>
          },
          {
            path: '/admin/products/:productId',
            element: <ProductSingle/>,
            children: [
              {
                path: '/admin/products/:productId',
                element: <ProductSummary/>
              },
              {
                path: '/admin/products/:productId/variants',
                element: <ProductVariants/>
              },
              {
                path: '/admin/products/:productId/ratings',
                element: <ProductRatings/>
              },
              {
                path: '/admin/products/:productId/insights',
                element: <ProductInsights/>
              },
              {
                path: '/admin/products/:productId/analytics',
                element: <ProductAnalytics/>
              },
              {
                path: '/admin/products/:productId/inventory',
                element: <ProductInventory/>
              },
              {
                path: '/admin/products/:productId/files',
                element: <ProductFiles/>
              },
              {
                path: '/admin/products/:productId/paid-files',
                element: <ProductPaidFiles/>
              },
              {
                path: '/admin/products/:productId/preview',
                element: <ProductPreview/>
              }
            ]
          }
        ]
      },
      {
        path: '/admin/product-tags',
        children: [
          {
            path: '/admin/product-tags',
            element: <ProductTags/>
          },
          {
            path: '/admin/product-tags/:productTagId',
            element: <ProductTagSummary/>,
          }
        ]
      },
      {
        path: '/admin/product-categories',
        children: [
          {
            path: '/admin/product-categories',
            element: <ProductCategories/>
          },
          {
            path: '/admin/product-categories/:productCategoryId',
            element: <ProductCategorySummary/>,
          }
        ]
      },
      {
        path: '/admin/product-attributes',
        children: [
          {
            path: '/admin/product-attributes',
            element: <ProductAttributes/>
          },
          {
            path: '/admin/product-attributes/:productAttributeId',
            element: <ProductAttributeSummary/>,
          }
        ]
      },
      {
        path: '/admin/invoices',
        children: [
          {
            path: '/admin/invoices',
            element: <Invoices/>
          },
          {
            path: '/admin/invoices/create',
            element: <InvoiceCreate/>
          },
          {
            path: '/admin/invoices/:invoiceId',
            children: [
              {
                path: '/admin/invoices/:invoiceId',
                element: <InvoiceSummary/>
              },
              {
                path: '/admin/invoices/:invoiceId/preview',
                element: <InvoicePreview/>
              }
            ]
          }
        ]
      },
      {
        path: '/admin/roles-and-permissions',
        element: <RolesAndPermissions/>,
        children: [
          {
            path: '/admin/roles-and-permissions',
            element: <RolesAndPermissionsGeneralInformationTab/>
          },
          {
            path: '/admin/roles-and-permissions/:role',
            element: <RoleTab/>
          },
        ]
      },
      {
        path: '/admin/system-users',
        element: <SystemUsersList/>,
      },
      {
        path: '/admin/import',
        element: <ImportData/>,
      },
      {
        path: '/admin/reports',
        element: <Reports/>,
      },
      {
        path: '/admin/notifications',
        element: <Notifications/>,
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
];

export default routes;
