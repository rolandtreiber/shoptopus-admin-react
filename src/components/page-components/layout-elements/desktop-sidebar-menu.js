import {useEffect, useState} from 'react';
import {matchPath, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Box, Divider, Drawer, IconButton, List} from '@material-ui/core';
import {DektopSidebarMenuItem} from './dektop-sidebar-menu-item';
import {Scrollbar} from '../../common/scrollbar';
import {ChevronLeft as ChevronLeftIcon} from '../../../icons/chevron-left';
import {ChevronRight as ChevronRightIcon} from '../../../icons/chevron-right';
import {Cog as CogIcon} from '../../../icons/cog';
import {CustomChartPie as ChartPieIcon} from '../../../icons/custom-chart-pie';
import {CustomCube as CubeIcon} from '../../../icons/custom-cube';
import {CustomShoppingCart as ShoppingCartIcon} from '../../../icons/custom-shopping-cart';
import {CustomUsers as UsersIcon} from '../../../icons/custom-users';
import {ReceiptTax as ReceiptTaxIcon} from '../../../icons/receipt-tax';
import {DeliveryVan as DeliveryVan} from '../../../icons/delivery';
import {Discount as Discount} from "../../../icons/discount";
import {Payment} from "../../../icons/payment";
import {Star} from "../../../icons/star";
import {Content} from "../../../icons/content";
import {Dashboard} from "../../../icons/dashboard";
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
        icon: ReceiptTaxIcon,
        title: 'Invoices',
        href: '/admin/invoices',
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
        icon: ImportContacts,
        title: 'Import Data',
        href: '/admin/import',
    },
    {
        icon: ChartPieIcon,
        title: 'Reports',
        href: '/admin/reports'
    },
];

export const DesktopSidebarMenu = (props) => {
    const {onPin, pinned} = props;
    const {pathname} = useLocation();
    const [openedItem, setOpenedItem] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [activeHref, setActiveHref] = useState('');
    const [hovered, setHovered] = useState(false);

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
                    const active = matchPath({path: item.items[index].href, end: true}, pathname);

                    if (active) {
                        setActiveItem(item);
                        setActiveHref(item.items[index].href);
                        setOpenedItem(item);
                        break;
                    }
                }
            } else {
                const active = !!matchPath({path: item.href, end: true}, pathname);

                if (active) {
                    setActiveItem(item);
                    setOpenedItem(item);
                }
            }
        });
    }, [pathname]);

    return (
        <Drawer
            open
            sx={{zIndex: 1000}}
            variant="permanent"
            PaperProps={{
                onMouseOver: () => {
                    setHovered(true);
                },
                onMouseLeave: () => {
                    setHovered(false);
                },
                sx: {
                    backgroundColor: 'background.paper',
                    height: 'calc(100% - 64px)',
                    overflowX: 'hidden',
                    top: 64,
                    transition: 'width 250ms ease-in-out',
                    width: pinned ? 270 : 73,
                    '& .simplebar-content': {
                        height: '100%'
                    },
                    '&:hover': {
                        width: 270,
                        '& span, p': {
                            display: 'flex'
                        }
                    }
                }
            }}
        >
            <Scrollbar
                style={{
                    display: 'flex',
                    flex: 1,
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        p: 2
                    }}
                >
                    <List disablePadding>
                        {(items.map((item) => (
                            <DektopSidebarMenuItem
                                active={activeItem?.title === item.title}
                                activeHref={activeHref}
                                key={item.title}
                                onOpen={() => handleOpenItem(item)}
                                open={openedItem?.title === item.title && (hovered || pinned)}
                                pinned={pinned}
                                {...item}
                            />
                        )))}
                    </List>
                    <Box sx={{flexGrow: 1}}/>
                    <Divider/>
                    <Box sx={{pt: 1}}>
                        <IconButton onClick={onPin}>
                            {pinned ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </Box>
                </Box>
            </Scrollbar>
        </Drawer>
    );
};

DesktopSidebarMenu.propTypes = {
    onPin: PropTypes.func,
    pinned: PropTypes.bool
};
