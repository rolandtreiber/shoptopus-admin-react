import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Drawer, List } from '@material-ui/core';
import { MobileNavbarMenuItem } from './mobile-navbar-menu-item';
import { Cog as CogIcon } from '../../../icons/cog';
import { CustomChartPie as ChartPieIcon } from '../../../icons/custom-chart-pie';
import { CustomCube as CubeIcon } from '../../../icons/custom-cube';
import { CustomShoppingCart as ShoppingCartIcon } from '../../../icons/custom-shopping-cart';
import { CustomUsers as UsersIcon } from '../../../icons/custom-users';
import { OfficeBuilding as OfficeBuildingIcon } from '../../../icons/office-building';
import {Dashboard} from "../../../icons/dashboard";
import {Discount} from "../../../icons/discount";
import {DeliveryVan} from "../../../icons/delivery";
import {Payment} from "../../../icons/payment";
import {Star} from "../../../icons/star";
import {Content} from "../../../icons/content";
import {ImportContacts} from "@material-ui/icons";

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
  },
  {
    icon: CubeIcon,
    title: 'Orders',
    href: '/admin/orders',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Products',
    items: [
      {
        href: '/admin/products',
        title: 'List'
      },
      {
        href: '/admin/product-categories',
        title: 'Categories'
      },
      {
        href: '/admin/product-attributes',
        title: 'Attributes'
      },
      {
        href: '/admin/product-tags',
        title: 'Tags'
      }
    ]
  },
  {
    icon: Discount,
    title: 'Discount',
    items: [
      {
        href: '/admin/discount/voucher-codes',
        title: 'Voucher Codes'
      },
      {
        href: '/admin/discount/rules',
        title: 'Discount Rules'
      }
    ]
  },
  {
    icon: DeliveryVan,
    title: 'Delivery Types',
    href: '/admin/delivery-types'
  },
  {
    icon: Payment,
    title: 'Transactions',
    href: '/admin/transactions',
  },
  {
    icon: Star,
    title: 'Ratings',
    href: '/admin/ratings',
  },
  {
    icon: Content,
    title: 'Content',
    items: [
      {
        href: '/admin/content/banners',
        title: 'Banners'
      },
      {
        href: '/admin/content/files',
        title: 'Files'
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
    icon: OfficeBuildingIcon,
    title: 'Organization',
    items: [
      {
        href: '/admin/organization',
        title: 'General Settings'
      },
      {
        href: '/admin/organization/team',
        title: 'Team'
      },
      {
        href: '/admin/organization/billing',
        title: 'Billing'
      }
    ]
  },
  {
    icon: ImportContacts,
    title: 'Import Data',
    href: '/admin/import',
  },
  {
    icon: ChartPieIcon,
    title: 'Reports',
    href: '/admin/reports'
  }
];

export const MobileNavbarMenu = (props) => {
  const { open, onClose } = props;
  const { pathname } = useLocation();
  const [openedItem, setOpenedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeHref, setActiveHref] = useState('');

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
          <MobileNavbarMenuItem
            active={activeItem?.title === item.title}
            activeHref={activeHref}
            key={item.title}
            onClose={onClose}
            onOpenItem={() => handleOpenItem(item)}
            open={openedItem?.title === item.title}
            {...item}
          />
        )))}
      </List>
    </Drawer>
  );
};

MobileNavbarMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
