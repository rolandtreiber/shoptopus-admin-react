import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Grid } from '@material-ui/core';
import { ProductChannel } from '../products/components/product-channel';
import { ProductReturnRate } from '../products/components/product-return-rate';
import { ProductReviews } from '../products/components/product-reviews';
import { ProductSalesReport } from '../products/components/product-sales-report';
import gtm from '../../lib/gtm';
import {TrTypography} from "../../components/common/translated/translated-typography";

export const ProductAnalytics = () => {
  const {appName} = useContext(SettingsContext)

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Product: Analytics | {appName}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          width: '100%'
        }}
      >
        <Grid container spacing={3}>
          <Grid
            container
            item
            md={4}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <TrTypography
                color="textPrimary"
                variant="h6"
              >
                All time
              </TrTypography>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Card variant="outlined">
                <CardContent>
                  <TrTypography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Monthly Recurring Revenue
                  </TrTypography>
                  <TrTypography
                    color="textPrimary"
                    variant="h4"
                  >
                    € 3,200.00
                  </TrTypography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Card variant="outlined">
                <CardContent>
                  <TrTypography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Order count for this product
                  </TrTypography>
                  <TrTypography
                    color="textPrimary"
                    variant="h4"
                  >
                    356
                  </TrTypography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <ProductReviews />
            </Grid>
          </Grid>
          <Grid
            container
            item
            md={8}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <TrTypography
                color="textPrimary"
                variant="h6"
              >
                Last 30 days
              </TrTypography>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <ProductSalesReport />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <ProductChannel />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <ProductReturnRate />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
