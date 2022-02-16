import {useCallback, useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Grid, Typography } from '@material-ui/core';
import { PerformanceIndicators } from '../components/reports/performance-indicators';
import { ProductsBreakdown } from '../components/reports/products-breakdown';
import { Ban as BanIcon } from '../icons/ban';
import { Cash as CashIcon } from '../icons/cash';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { X as XIcon } from '../icons/x';
import gtm from '../lib/gtm';
import {APIContext} from "../contexts/api-context";
import {useMounted} from "../hooks/use-mounted";
import Price from "../components/price";

const stats = [
  {
    content: '$25,100.00',
    icon: BanIcon,
    iconColor: 'error.main',
    label: 'Unrealized Revenue'
  },
  {
    content: '$25,100.00',
    icon: CashIcon,
    iconColor: 'success.main',
    label: 'Total Revenue'
  },
  {
    content: '$25,100.00',
    icon: ShoppingBagIcon,
    iconColor: 'warning.main',
    label: 'Total Delivery'
  },
  {
    content: '$25,100.00',
    icon: XIcon,
    iconColor: 'info.main',
    label: 'Total Discount'
  }
];

export const ReportsSales = () => {
  const {fetchReportsSales} = useContext(APIContext)
  const [data, setData] = useState({isLoading: true})
  const mounted = useMounted();
  const [salesRange, setSalesRange] = useState(1)
  const [productsBreakdownRange, setProductsBreakdownRange] = useState(1)
  const [categoryId, setCategoryId] = useState()
  const [stats, setStats] = useState()

  const getData = useCallback(async (setLoading = true) => {
    setLoading && setData(() => ({ isLoading: true }));

    try {
      const {data: {data}} = await fetchReportsSales({
        'revenue_over_time_range': salesRange,
        'products_breakdown_time_range': productsBreakdownRange,
        'category_id': categoryId
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
  }, [salesRange, productsBreakdownRange, categoryId]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    getData().catch(e => console.log(e))
  }, []);

  useEffect(() => {
    getData(false).catch(e => console.log(e))
  }, [salesRange, productsBreakdownRange, categoryId]);

  useEffect(() => {
    if (data.data) {
      setStats([
        {
          content: <Price>{data.data?.totals?.unrealized_revenue}</Price>,
          icon: BanIcon,
          iconColor: 'error.main',
          label: 'Unrealized Revenue'
        },
        {
          content: <Price>{data.data?.totals?.total_revenue}</Price>,
          icon: CashIcon,
          iconColor: 'success.main',
          label: 'Total Revenue'
        },
        {
          content: <Price>{data.data?.totals?.total_delivery}</Price>,
          icon: ShoppingBagIcon,
          iconColor: 'warning.main',
          label: 'Total Delivery'
        },
        {
          content: <Price>{data.data?.totals?.total_discount}</Price>,
          icon: XIcon,
          iconColor: 'info.main',
          label: 'Total Discount'
        }
      ])
    }
  }, [data])

  return (
    <>
      <Helmet>
        <title>Reports: Sales | Carpatin Dashboard</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PerformanceIndicators data={data.data?.revenue_over_time} onRangeChange={setSalesRange}/>
          </Grid>
          {stats && <Grid
            container
            item
            spacing={3}
            md={4}
            xs={12}
          >
            {stats.map((item) => {
              const { icon: Icon, iconColor, content, label } = item;

              return (
                <Grid
                  item
                  key={label}
                  md={12}
                  sm={6}
                  xs={12}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      alignItems: 'center',
                      borderRadius: 1,
                      display: 'flex',
                      p: 2
                    }}
                  >
                    <Icon sx={{ color: iconColor || 'text.secondary' }} />
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        color="textSecondary"
                        variant="overline"
                      >
                        {label}
                      </Typography>
                      <Typography
                        color="textPrimary"
                        variant="h6"
                      >
                        {content}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>}
          <Grid
            item
            md={8}
            xs={12}
          >
            <ProductsBreakdown data={data.data?.products_breakdown.data}
                               categories={data.data?.products_breakdown.categories}
                               categoryUpdated={setCategoryId}
                               category={categoryId}
                               onRangeChange={setProductsBreakdownRange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
