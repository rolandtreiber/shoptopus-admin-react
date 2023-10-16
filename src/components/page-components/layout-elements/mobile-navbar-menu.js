import {Fragment, useContext, useEffect, useState} from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Drawer, List } from '@material-ui/core';
import { MobileNavbarMenuItem } from './mobile-navbar-menu-item';
import { Cog as CogIcon } from '../../../icons/cog';
import { CustomChartPie as ChartPieIcon } from '../../../icons/custom-chart-pie';
import { CustomCube as CubeIcon } from '../../../icons/custom-cube';
import { CustomShoppingCart as ShoppingCartIcon } from '../../../icons/custom-shopping-cart';
import { CustomUsers as UsersIcon } from '../../../icons/custom-users';
import {Dashboard} from "../../../icons/dashboard";
import {Discount} from "../../../icons/discount";
import {DeliveryVan} from "../../../icons/delivery";
import {Payment} from "../../../icons/payment";
import {Star} from "../../../icons/star";
import {Content} from "../../../icons/content";
import {ImportContacts, LockOpen, Person} from "@material-ui/icons";
import {AuthContext} from "../../../contexts/oauth-context";

const items = [
  {
    icon: Dashboard,
    title: 'Dashboard',
    href: '/admin/dashboard'
  },
  {
    icon: UsersIcon,
    title: 'Customers',
    href: '/admin/customers',
    permission: 'customers.can.list'
  },
  {
    icon: CubeIcon,
    title: 'Orders',
    href: '/admin/orders',
    permission: 'orders.can.list'
  },
  {
    icon: ShoppingCartIcon,
    title: 'Products',
    items: [
      {
        href: '/admin/products',
        title: 'List',
        permission: 'products.can.list'
      },
      {
        href: '/admin/product-categories',
        title: 'Categories',
        permission: 'product.categories.can.list'
      },
      {
        href: '/admin/product-attributes',
        title: 'Attributes',
        permission: 'product.attributes.can.list'
      },
      {
        href: '/admin/product-tags',
        title: 'Tags',
        permission: 'product.tags.can.list'
      }
    ]
  },
  {
    icon: Discount,
    title: 'Discount',
    items: [
      {
        href: '/admin/discount/voucher-codes',
        title: 'Voucher Codes',
        permission: 'voucher.codes.can.list'
      },
      {
        href: '/admin/discount/rules',
        title: 'Discount Rules',
        permission: 'discount.rules.can.list'
      }
    ]
  },
  {
    icon: DeliveryVan,
    title: 'Delivery Types',
    href: '/admin/delivery-types',
    permission: 'delivery.types.can.list'
  },
  {
    icon: Payment,
    title: 'Transactions',
    href: '/admin/transactions',
    permission: 'payments.can.list'
  },
  {
    icon: Star,
    title: 'Ratings',
    href: '/admin/ratings',
    permission: 'ratings.can.list'
  },
  {
    icon: Content,
    title: 'Content',
    items: [
      {
        href: '/admin/content/banners',
        title: 'Banners',
        permission: 'banners.can.list'
      },
      {
        href: '/admin/content/files',
        title: 'Files',
        permission: 'files.can.list'
      }
    ]
  },
  {
    icon: CogIcon,
    title: 'Account',
    items: [
      {
        href: '/admin/account',
        title: 'General Settings'
      },
      {
        href: '/admin/account/notifications',
        title: 'Notifications'
      }
    ]
  },
  {
    icon: Person,
    title: 'System Users',
    href: '/admin/system-users',
    permission: 'users.can.list'
  },
  {
    icon: LockOpen,
    title: 'Roles and Permissions',
    href: '/admin/roles-and-permissions',
    permission: 'users.can.update'
  },
  {
    icon: ImportContacts,
    title: 'Import Data',
    href: '/admin/import',
    permission: 'can.import.mass.records'
  },
  {
    icon: ChartPieIcon,
    title: 'Reports',
    href: '/admin/reports',
    permission: 'reports.can.list'
  },
];

export const MobileNavbarMenu = (props) => {
  const { open, onClose } = props;
  const { pathname } = useLocation();
  const [openedItem, setOpenedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeHref, setActiveHref] = useState('');
  const {can} = useContext(AuthContext)

  const handleOpenItem = (item) => {
    if (openedItem === item) {
      setOpenedItem(null);
      return;
    }

    setOpenedItem(item);
  };

  useEffect(() => {
    items.forEach((item) => {
      if (item.items) {
        for (let index = 0; index < item.items.length; index++) {
          const active = matchPath({ path: item.items[index].href, end: true }, pathname);

          if (active) {
            setActiveItem(item);
            setActiveHref(item.items[index].href);
            setOpenedItem(item);
            break;
          }
        }
      } else {
        const active = !!matchPath({ path: item.href, end: true }, pathname);

        if (active) {
          setActiveItem(item);
          setOpenedItem(item);
        }
      }
    });
  }, [pathname]);

  return (
    <Drawer
      anchor="top"
      onClose={onClose}
      open={open}
      transitionDuration={0}
      ModalProps={{
        BackdropProps: {
          invisible: true
        }
      }}
      PaperProps={{
        sx: {
          backgroundColor: '#2B2F3C',
          color: '#B2B7C8',
          display: 'flex',
          flexDirection: 'column',
          top: 64,
          maxHeight: 'calc(100% - 64px)',
          width: '100vw'
        }
      }}
    >
      <List>
        {(items.map((item) => (
          <Fragment key={item.title}>
            {(item.permission === undefined || can(item.permission)) && <MobileNavbarMenuItem
            active={activeItem?.title === item.title}
            activeHref={activeHref}
            key={item.title}
            onClose={onClose}
            onOpenItem={() => handleOpenItem(item)}
            open={openedItem?.title === item.title}
            {...item}
            />}</Fragment>
        )))}
      </List>
    </Drawer>
  );
};

MobileNavbarMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
