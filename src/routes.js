import {Suspense, lazy} from 'react';
import {AuthGuard} from './components/guards/auth-guard';
import {GuestGuard} from './components/guards/guest-guard';
import {CustomerSingle} from './pages/customers/customer-single';
import {LoadingScreen} from './components/page-components/layout-elements/loading-screen';
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
const Register = Loadable(lazy(() => import('./pages/auth/register').then((module) => ({default: module.Register}))));
const VerifyCode = Loadable(lazy(() => import('./pages/auth/verify-code').then((module) => ({default: module.VerifyCode}))));

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
const ProductSummary = Loadable(lazy(() => import('./pages/products/product-summary').then((module) => ({default: module.ProductSummary}))));

const AccountGeneral = Loadable(lazy(() => import('./pages/account/account-general').then((module) => ({default: module.AccountGeneral}))));
const AccountNotifications = Loadable(lazy(() => import('./pages/account/account-notifications').then((module) => ({default: module.AccountNotifications}))));

const ProductCategories = Loadable(lazy(() => import('./pages/product-categories/product-categories-list').then((module) => ({default: module.ProductCategoriesList}))));
const ProductAttributes = Loadable(lazy(() => import('./pages/product-attributes/product-attributes-list').then((module) => ({default: module.ProductAttributesList}))));
const ProductTags = Loadable(lazy(() => import('./pages/product-tags/product-tags-list').then((module) => ({default: module.ProductTagsList}))));

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
    path: 'reset-password',
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
            element: <DeliveryType/>
          }
        ]
      },
      {
        path: 'transactions',
        children: [
          {
            path: '/',
            element: <Transactions/>
          },
          {
            path: ':transactionId',
            element: <Transaction/>
          }
        ]
      },
      {
        path: 'ratings',
        children: [
          {
            path: '/',
            element: <Ratings/>
          },
          {
            path: ':ratingId',
            element: <Rating/>
          }
        ]
      },
      {
        path: 'content',
        children: [
          {
            path: 'banners',
            children: [
              {
                path: '/',
                element: <Banners/>
              },
              {
                path: ':bannerId',
                element: <Banner/>
              }
            ]
          },
          {
            path: 'files',
            children: [
              {
                path: '/',
                element: <Files/>
              },
              {
                path: ':fileId',
                element: <FileContent/>
              }
            ]
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
            element: <CustomerSingle/>,
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
            children: [
              {
                path: '/',
                element: <DiscountRules/>
              },
              {
                path: ':discountRuleId',
                element: <DiscountRule/>
              }
            ]
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
            element: <ProductSingle/>,
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
