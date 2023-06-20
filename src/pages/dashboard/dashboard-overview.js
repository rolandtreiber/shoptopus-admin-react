import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Grid } from '@material-ui/core';
import { Notifications } from '../../components/page-components/reports/notifications';
import { SummaryItem } from '../../components/page-components/reports/summary-item';
import { Cube as CubeIcon } from '../../icons/cube';
import { ShoppingCart as ShoppingCartIcon } from '../../icons/shopping-cart';
import { CustomCreditCard as CustomCreditCardIcon } from '../../icons/custom-credit-card';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import {useMounted} from "../../hooks/use-mounted";
import {PieChartBreakdown} from "../../components/page-components/reports/pie-chart-breakdown";
import {Timeline} from "../../components/page-components/reports/timeline";

export const DashboardOverview = () => {
  const {fetchReportsOverview} = useContext(APIContext)
  const [data, setData] = useState({isLoading: true})
  const mounted = useMounted();
  const [signupsRange, setSignupsRange] = useState(1)
  const [ordersRange, setOrdersRange] = useState(1)
  const [stats, setStats] = useState()

  const getData = useCallback(async (setLoading = true) => {
    setLoading && setData(() => ({ isLoading: true }));

    try {
      const {data: {data}} = await fetchReportsOverview({
        'signups_chart_range': signupsRange,
        'orders_overview_chart_range': ordersRange,
      })
      const result = data;

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [signupsRange, ordersRange]);


  useEffect(() => {
    gtm.push({ event: 'page_view' });
    getData().catch(e => console.log(e))
  }, []);

  useEffect(() => {
    console.log(signupsRange)
    getData(false).catch(e => console.log(e))
  }, [signupsRange, ordersRange])

  useEffect(() => {
    if (data.data) {
      setStats([
        {
          content: data.data.stats.orders,
          icon: ShoppingCartIcon,
          label: 'Orders',
          linkHref: '/orders',
          linkLabel: 'Orders'
        },
        {
          content: data.data.stats.products,
          icon: CubeIcon,
          label: 'Products',
          linkHref: '/products',
          linkLabel: 'Products'
        },
        {
          content: data.data.stats.payments,
          icon: CustomCreditCardIcon,
          label: 'Transactions',
          linkHref: '/dashboard/transactions',
          linkLabel: 'Transactions'
        },
        {
          content: data.data.stats.customers,
          icon: CustomCreditCardIcon,
          label: 'Customers',
          linkHref: '/customers',
          linkLabel: 'Customers'
        }
      ])
    }
  }, [data])

  return (
    <>
      <Helmet>
        <title>Dashboard: Overview | Carpatin Dashboard</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Notifications />
          </Grid>
          {stats && stats.map((item) => (
            <Grid
              item
              key={item.label}
              md={3}
              xs={12}
            >
              <SummaryItem
                content={item.content}
                icon={item.icon}
                label={item.label}
                linkHref={item.linkHref}
                linkLabel={item.linkLabel}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Timeline title={'User Signups'} data={data.data?.user_signups_over_time} onRangeChange={setSignupsRange} />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <PieChartBreakdown series={data.data?.orders_by_status_pie_chart_data} title={"OrdersList Overview"} onRangeChange={setOrdersRange}/>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <PieChartBreakdown series={data.data?.products_by_status_pie_chart_data} title={"ProductsList Overview"} showRangeSelector={false}/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
