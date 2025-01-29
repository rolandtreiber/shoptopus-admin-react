import { Box, Card, Grid, Typography } from '@material-ui/core';
import { Cash as CashIcon } from '../../../icons/cash';
import { CheckCircle as CheckCircleIcon } from '../../../icons/check-circle';
import { ShoppingCart as ShoppingCartIcon } from '../../../icons/shopping-cart';
import { XCircle as XCircleIcon } from '../../../icons/x-circle';
import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useCurrency} from "../../../hooks/use-currency";
import {TrTypography} from "../../../components/common/translated/translated-typography";

const initialStats = [
  {
    content: '',
    icon: CheckCircleIcon,
    iconColor: 'success.main',
    label: 'Total Stock'
  },
  {
    content: '',
    icon: XCircleIcon,
    iconColor: 'warning.main',
    label: 'Out of stock Items'
  },
  {
    content: '',
    icon: CashIcon,
    iconColor: 'primary.main',
    label: 'Retail Value'
  },
  {
    content: '',
    icon: ShoppingCartIcon,
    iconColor: 'secondary.main',
    label: 'Low stock (<15)'
  }
];

export const ProductsSummary = () => {
  const {getProductsPageSummary} = useContext(APIContext)
  const [stats, setStats] = useState(initialStats)
  const {getPriceText} = useCurrency()

  const getSummary = useCallback(async () => {
    const result = await getProductsPageSummary()

    if (result.data) {
      return result.data
    }
  }, [])

  useEffect(() => {
    getSummary().then(r => setStats([
      {...stats[0], content: r.data.total_stock},
      {...stats[1], content: r.data.out_of_stock_items},
      {...stats[2], content: getPriceText(r.data.retail_value)},
      {...stats[3], content: r.data.running_low}
      ]))
  }, [])

  return (<Card
    sx={{mb: 3}}
    variant="outlined"
  >
    <Grid container>
      {stats.map((item, index) => {
        const {icon: Icon, iconColor, content, label} = item;

        return (
          <Grid
            item
            key={item.label}
            md={3}
            sm={6}
            sx={{
              borderBottom: (theme) => ({
                md: 0,
                sm: stats.length > index + 2 ? `1px solid ${theme.palette.divider}` : 0,
                xs: stats.length > index + 1 ? `1px solid ${theme.palette.divider}` : 0
              }),
              borderRight: (theme) => ({
                md: stats.length > index + 1 ? `1px solid ${theme.palette.divider}` : 0,
                xs: 0
              })
            }}
            xs={12}
          >
            <Box
              sx={{
                alignItems: 'center',
                borderRadius: 1,
                display: 'flex',
                p: 2
              }}
            >
              <Icon sx={{color: iconColor || 'text.secondary'}}/>
              <Box sx={{ml: 2}}>
                <TrTypography
                  color="textSecondary"
                  variant="overline"
                >
                  {label}
                </TrTypography>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  {content}
                </Typography>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Card>)
};
