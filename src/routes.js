import {Suspense, lazy} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthGuard} from './components/auth-guard';
import {GuestGuard} from './components/guest-guard';
import {Customer} from './containers/customer';
import {LoadingScreen} from './components/loading-screen';
import {Account} from './containers/account';
import {DashboardLayout} from './containers/dashboard-layout';
import {Organization} from './containers/organization';
import {Product} from './containers/product';
import {Dashboard} from './containers/dashboard';
import {DashboardOverview} from "./containers/dashboard-overview";
import {DashboardSales} from "./containers/dashboard-sales";

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen/>}>
    <Component {...props} />
  </Suspense>
);

// Not found pages
const NotFound = Loadable(lazy(() => import('./containers/not-found').then((module) => ({default: module.NotFound}))));

// Auth pages
const Login = Loadable(lazy(() => import('./containers/login').then((module) => ({default: module.Login}))));
const PasswordRecovery = Loadable(lazy(() => import('./containers/password-recovery').then((module) => ({default: module.PasswordRecovery}))));
const PasswordReset = Loadable(lazy(() => import('./containers/password-reset').then((module) => ({default: module.PasswordReset}))));
const Register = Loadable(lazy(() => import('./containers/register').then((module) => ({default: module.Register}))));
const VerifyCode = Loadable(lazy(() => import('./containers/verify-code').then((module) => ({default: module.VerifyCode}))));

// Import
const ImportData = Loadable(lazy(() => import('./containers/import').then((module) => ({default: module.Import}))));

// Dashboard pages
const ReportsOverview = Loadable(lazy(() => import('./containers/dashboard-overview').then((module) => ({default: module.DashboardOverview}))));
const ReportsSales = Loadable(lazy(() => import('./containers/dashboard-sales').then((module) => ({default: module.DashboardSales}))));

const Customers = Loadable(lazy(() => import('./containers/customers').then((module) => ({default: module.Customers}))));
const CustomerActivity = Loadable(lazy(() => import('./containers/customer-activity').then((module) => ({default: module.CustomerActivity}))));
const CustomerOrders = Loadable(lazy(() => import('./containers/customer-orders').then((module) => ({default: module.CustomerOrders}))));
const CustomerSummary = Loadable(lazy(() => import('./containers/customer-summary').then((module) => ({default: module.CustomerSummary}))));

const Order = Loadable(lazy(() => import('./containers/order').then((module) => ({default: module.Order}))));
const Orders = Loadable(lazy(() => import('./containers/orders').then((module) => ({default: module.Orders}))));

const Invoices = Loadable(lazy(() => import('./containers/invoices').then((module) => ({default: module.Invoices}))));
const InvoiceCreate = Loadable(lazy(() => import('./containers/invoice-create').then((module) => ({default: module.InvoiceCreate}))));
const InvoiceSummary = Loadable(lazy(() => import('./containers/invoice').then((module) => ({default: module.Invoice}))));
const InvoicePreview = Loadable(lazy(() => import('./containers/invoice-preview').then((module) => ({default: module.InvoicePreview}))));

const Products = Loadable(lazy(() => import('./containers/products').then((module) => ({default: module.Products}))));
const ProductAnalytics = Loadable(lazy(() => import('./containers/product-analytics').then((module) => ({default: module.ProductAnalytics}))));
const ProductInventory = Loadable(lazy(() => import('./containers/product-inventory').then((module) => ({default: module.ProductInventory}))));
const ProductSummary = Loadable(lazy(() => import('./containers/product-summary').then((module) => ({default: module.ProductSummary}))));

const AccountGeneral = Loadable(lazy(() => import('./containers/account-general').then((module) => ({default: module.AccountGeneral}))));
const AccountNotifications = Loadable(lazy(() => import('./containers/account-notifications').then((module) => ({default: module.AccountNotifications}))));

const OrganizationBilling = Loadable(lazy(() => import('./containers/organization-billing').then((module) => ({default: module.OrganizationBilling}))));
const OrganizationGeneral = Loadable(lazy(() => import('./containers/organization-general').then((module) => ({default: module.OrganizationGeneral}))));
const OrganizationTeam = Loadable(lazy(() => import('./containers/organization-team').then((module) => ({default: module.OrganizationTeam}))));

const ProductCategories = Loadable(lazy(() => import('./containers/product-categories').then((module) => ({default: module.default}))));
const ProductAttributes = Loadable(lazy(() => import('./containers/product-attributes').then((module) => ({default: module.default}))));
const ProductTags = Loadable(lazy(() => import('./containers/product-tags').then((module) => ({default: module.default}))));

const ProductCategorySummary = Loadable(lazy(() => import('./containers/product-category-summary').then((module) => ({default: module.ProductCategorySummary}))));
const ProductAttributeSummary = Loadable(lazy(() => import('./containers/product-attribute-summary').then((module) => ({default: module.ProductAttributeSummary}))));
const ProductTagSummary = Loadable(lazy(() => import('./containers/product-tag-summary').then((module) => ({default: module.ProductTagSummary}))));
const DeliveryTypeSummary = Loadable(lazy(() => import('./containers/delivery-type-summary').then((module) => ({default: module.DeliveryTypeSummary}))));

const VoucherCodes = Loadable(lazy(() => import('./containers/voucher-codes').then((module) => ({default: module.VoucherCodes}))));
const VoucherCode = Loadable(lazy(() => import('./containers/voucher-code').then((module) => ({default: module.VoucherCode}))));


const DiscountRules = Loadable(lazy(() => import('./containers/discount-rules').then((module) => ({default: module.DiscountRules}))));
const DeliveryTypes = Loadable(lazy(() => import('./containers/delivery-types').then((module) => ({default: module.DeliveryTypes}))));
const Transactions = Loadable(lazy(() => import('./containers/transactions').then((module) => ({default: module.Transactions}))));
const Ratings = Loadable(lazy(() => import('./containers/ratings').then((module) => ({default: module.Ratings}))));
const Banners = Loadable(lazy(() => import('./containers/banners').then((module) => ({default: module.Banners}))));
const Files = Loadable(lazy(() => import('./containers/files').then((module) => ({default: module.Files}))));

const Reports = Loadable(lazy(() => import('./containers/reports').then((module) => ({default: module.Reports}))));
const Notifications = Loadable(lazy(() => import('./containers/notifications').then((module) => ({default: module.Notifications}))));

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
    path: 'login',
    element: (
      <GuestGuard>
        <Login/>
      </GuestGuard>
    )
  },
  {
    path: 'register',
    element: (
      <GuestGuard>
        <Register/>
      </GuestGuard>
    )
  },
  {
    path: 'verify-code',
    element: (
      <GuestGuard>
        <VerifyCode/>
      </GuestGuard>
    )
  },
  {
    path: 'password-recovery',
    element: (
      <GuestGuard>
        <PasswordRecovery/>
      </GuestGuard>
    )
  },
  {
    path: 'password-reset',
    element: (
      <PasswordReset/>
    )
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout/>
      </AuthGuard>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>,
        children: [
          {
            path: '/',
            element: <DashboardOverview/>
          },
          {
            path: 'sales',
            element: <DashboardSales/>
          }
        ]
      },
      {
        path: 'delivery-types',
        children: [
          {
            path: '/',
            element: <DeliveryTypes/>
          },
          {
            path: ':deliveryTypeId',
            element: <DeliveryTypeSummary/>
          }
        ]
      },
      {
        path: 'transactions',
        element: <Transactions/>
      },
      {
        path: 'ratings',
        element: <Ratings/>
      },
      {
        path: 'content',
        children: [
          {
            path: 'banners',
            element: <Banners/>
          },
          {
            path: 'files',
            element: <Files/>
          }
        ]
      },
      {
        path: 'account',
        element: <Account/>,
        children: [
          {
            path: '/',
            element: <AccountGeneral/>
          },
          {
            path: 'notifications',
            element: <AccountNotifications/>
          },
          {
            path: 'team',
            element: <OrganizationTeam/>
          }
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: '/',
            element: <Customers/>
          },
          {
            path: ':customerId',
            element: <Customer/>,
            children: [
              {
                path: '/',
                element: <CustomerSummary/>
              },
              {
                path: 'activity',
                element: <CustomerActivity/>
              },
              {
                path: 'orders',
                element: <CustomerOrders/>
              }
            ]
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            path: '/',
            element: <Orders/>
          },
          {
            path: ':orderId',
            element: <Order/>
          }
        ]
      },
      {
        path: 'organization',
        element: <Organization/>,
        children: [
          {
            path: '/',
            element: <OrganizationGeneral/>
          },
          {
            path: '/team',
            element: <OrganizationTeam/>
          },
          {
            path: '/billing',
            element: <OrganizationBilling/>
          }
        ]
      },
      {
        path: 'discount',
        children: [
          {
            path: 'voucher-codes',
            children: [
              {
                path: '/',
                element: <VoucherCodes/>
              },
              {
                path: ':voucherCodeId',
                element: <VoucherCode/>
              }
            ]
          },
          {
            path: 'rules',
            element: <DiscountRules/>
          },
        ]
      },
      {
        path: 'products',
        children: [
          {
            path: '/',
            element: <Products/>
          },
          {
            path: ':productId',
            element: <Product/>,
            children: [
              {
                path: '/',
                element: <ProductSummary/>
              },
              {
                path: 'analytics',
                element: <ProductAnalytics/>
              },
              {
                path: 'inventory',
                element: <ProductInventory/>
              }
            ]
          }
        ]
      },
      {
        path: 'product-tags',
        children: [
          {
            path: '/',
            element: <ProductTags/>
          },
          {
            path: ':productTagId',
            element: <ProductTagSummary/>,
          }
        ]
      },
      {
        path: 'product-categories',
        children: [
          {
            path: '/',
            element: <ProductCategories/>
          },
          {
            path: ':productCategoryId',
            element: <ProductCategorySummary/>,
          }
        ]
      },
      {
        path: 'product-attributes',
        children: [
          {
            path: '/',
            element: <ProductAttributes/>
          },
          {
            path: ':productAttributeId',
            element: <ProductAttributeSummary/>,
          }
        ]
      },
      {
        path: 'invoices',
        children: [
          {
            path: '/',
            element: <Invoices/>
          },
          {
            path: 'create',
            element: <InvoiceCreate/>
          },
          {
            path: ':invoiceId',
            children: [
              {
                path: '/',
                element: <InvoiceSummary/>
              },
              {
                path: '/preview',
                element: <InvoicePreview/>
              }
            ]
          }
        ]
      },
      {
        path: 'import',
        element: <ImportData/>,
      },
      {
        path: 'reports',
        element: <Reports/>,
      },
      {
        path: 'notifications',
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
