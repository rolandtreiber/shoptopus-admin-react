import {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import {Box, Card, CardContent, CardHeader, Divider, Typography} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import RangeSelector from "./range-selector";
import Price from "../../../components/common/price";
import {useTranslation} from "react-i18next";
import {TrTypography} from "../../../components/common/translated/translated-typography";

const data = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      data: [0, 20, 40, 30, 30, 44, 90],
      name: 'Revenue'
    }
  ]
};

export const PerformanceIndicators = ({data, onRangeChange, snapshots}) => {
  const theme = useTheme();
  const [chartOptions, setChartOptions] = useState()
  const [stats, setStats] = useState()
  const { t } = useTranslation();

  useEffect(() => {
    if (snapshots) {
      setStats([
        {
          content: <Price>{snapshots.pending_orders}</Price>,
          label: 'Pending Orders'
        },
        {
          content: <Price>{snapshots.completed_orders}</Price>,
          label: 'Completed Orders'
        },
        {
          content: <Price>{snapshots.processing_orders}</Price>,
          label: 'Processing Orders'
        },
        {
          content: <Price>{snapshots.in_transit_orders}</Price>,
          label: 'In Transit Orders'
        },
        {
          content: <Price>{snapshots.cancelled_orders}</Price>,
          label: 'Cancelled Orders'
        }
      ])
    }
  }, [snapshots])

  useEffect(() => {
    if (data) {
      setChartOptions({
        chart: {
          background: 'transparent',
          stacked: false,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        legend: {
          show: true
        },
        colors: ['rgba(49, 129, 237, 1)'],
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient'
        },
        grid: {
          borderColor: theme.palette.divider,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          curve: 'straight'
        },
        theme: {
          mode: theme.palette.mode
        },
        tooltip: {
          theme: theme.palette.mode
        },
        xaxis: {
          axisBorder: {
            color: theme.palette.divider,
            show: true
          },
          axisTicks: {
            color: theme.palette.divider,
            show: true
          },
          categories: data.categories,
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        },
        yaxis: {
          labels: {
            offsetX: -12,
            style: {
              colors: theme.palette.text.secondary
            }
          }
        }
      })
    }
  }, [data])

  return (
    <Card
      variant="outlined"
    >
      <CardHeader
        action={(
          <RangeSelector onChange={onRangeChange}/>
        )}
        title={t("Key Performance Indicators")}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              md: 'repeat(5, 1fr)',
              sm: 'repeat(2, 1fr)',
              xs: 'repeat(1, 1fr)'
            }
          }}
        >
          {stats && stats.map((item) => (
            <Card
              key={item.label}
              variant="outlined"
              sx={{
                alignItems: 'center',
                borderRadius: 1,
                p: 2
              }}
            >
              <TrTypography
                color="textSecondary"
                variant="overline"
              >
                {item.label}
              </TrTypography>
              <Typography
                color="textPrimary"
                variant="h6"
              >
                {item.content}
              </Typography>
            </Card>
          ))}
        </Box>
        {data && chartOptions && <Chart
          height="350"
          options={chartOptions}
          series={data.series}
          type="area"
        />}
      </CardContent>
    </Card>
  );
};
