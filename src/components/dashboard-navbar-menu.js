import { useState, useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Drawer, List } from '@material-ui/core';
import { DashboardNavbarMenuItem } from './dashboard-navbar-menu-item';
import { Cog as CogIcon } from '../icons/cog';
import { CustomChartPie as ChartPieIcon } from '../icons/custom-chart-pie';
import { CustomCube as CubeIcon } from '../icons/custom-cube';
import { CustomShoppingCart as ShoppingCartIcon } from '../icons/custom-shopping-cart';
import { CustomUsers as UsersIcon } from '../icons/custom-users';
import { OfficeBuilding as OfficeBuildingIcon } from '../icons/office-building';
import { ReceiptTax as ReceiptTaxIcon } from '../icons/receipt-tax';
import { ColorSwatch as ColorSwatchIcon } from '../icons/color-swatch';
import { Template as TemplateIcon } from '../icons/template';
import { DocumentText as DocumentTextIcon } from '../icons/document-text';
import {Dashboard} from "../icons/dashboard";
import {Discount} from "../icons/discount";
import {DeliveryVan} from "../icons/delivery";
import {Payment} from "../icons/payment";
import {Star} from "../icons/star";
import {Content} from "../icons/content";
import {ImportContacts} from "@material-ui/icons";

const items = [
  {
    icon: Dashboard,
    title: 'Dashboard',
    href: '/dashboard'
  },
  {
    icon: UsersIcon,
    title: 'Customers',
    href: '/customers',
  },
  {
    icon: CubeIcon,
    title: 'Orders',
    href: '/orders',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Products',
    items: [
      {
        href: '/products',
        title: 'List'
      },
      {
        href: '/product-categories',
        title: 'Categories'
      },
      {
        href: '/product-attributes',
        title: 'Attributes'
      },
      {
        href: '/product-tags',
        title: 'Tags'
      }
    ]
  },
  {
    icon: Discount,
    title: 'Discount',
    items: [
      {
        href: '/discount/voucher-codes',
        title: 'Voucher Codes'
      },
      {
        href: '/discount/rules',
        title: 'Discount Rules'
      }
    ]
  },
  {
    icon: DeliveryVan,
    title: 'Delivery Types',
    href: '/delivery-types'
  },
  {
    icon: Payment,
    title: 'Transactions',
    href: '/transactions',
  },
  {
    icon: Star,
    title: 'Ratings',
    href: '/ratings',
  },
  {
    icon: ReceiptTaxIcon,
    title: 'Invoices',
    href: '/invoices',
  },
  {
    icon: Content,
    title: 'Content',
    items: [
      {
        href: '/content/banners',
        title: 'Banners'
      },
      {
        href: '/content/files',
        title: 'Files'
      }
    ]
  },
  {
    icon: CogIcon,
    title: 'Account',
    items: [
      {
        href: '/account',
        title: 'General Settings'
      },
      {
        href: '/account/notifications',
        title: 'Notifications'
      }
    ]
  },
  {
    icon: OfficeBuildingIcon,
    title: 'Organization',
    items: [
      {
        href: '/organization',
        title: 'General Settings'
      },
      {
        href: '/organization/team',
        title: 'Team'
      },
      {
        href: '/organization/billing',
        title: 'Billing'
      }
    ]
  },
  {
    icon: ImportContacts,
    title: 'Import Data',
    href: '/import',
  },
  {
    icon: ChartPieIcon,
    title: 'Reports',
    href: '/reports'
  }
];

export const DashboardNavbarMenu = (props) => {
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
        {activeItem && (items.map((item) => (
          <DashboardNavbarMenuItem
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

DashboardNavbarMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};
