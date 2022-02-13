import {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { ActionsMenu } from '../actions-menu';

const stats = [
  {
    content: '$191.02',
    label: 'Draft'
  },
  {
    content: '$320.50',
    label: 'Awaiting delivery'
  },
  {
    content: '$3,800.00',
    label: 'Due'
  },
  {
    content: '$3,500.00',
    label: 'Overdue'
  }
];

export const Timeline = (props) => {
  const {data, title} = props;
  const theme = useTheme();
  const [range, setRange] = useState('Last 7 days');
  const [chartOptions, setChartOptions] = useState()

  const ranges = [
    {
      label: 'Last 7 days',
      onClick: () => { setRange('Last 7 days'); }
    },
    {
      label: 'Last Month',
      onClick: () => { setRange('Last Month'); }
    },
    {
      label: 'Last Year',
      onClick: () => { setRange('Last Year'); }
    }
  ];

  useEffect(() => {
    if (data) {
      setChartOptions({
        chart: {
          background: 'transparent',
          toolbar: {
            show: false
          }
        },
        colors: ['rgba(6, 70, 153, 1)', 'rgba(49, 129, 237, 1)'],
        dataLabels: {
          enabled: false
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
        legend: {
          markers: {
            radius: 50
          }
        },
        states: {
          active: {
            filter: {
              type: 'none'
            }
          },
          hover: {
            filter: {
              type: 'none'
            }
          }
        },
        stroke: {
          show: false
        },
        theme: {
          mode: theme.palette.mode
        },
        tooltip: {
          theme: theme.palette.mode
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
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
        }})
    }
  }, [data])

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <CardHeader
        action={(
          <ActionsMenu
            actions={ranges}
            label={range}
            size="small"
            variant="text"
          />
        )}
        title={title}
      />
      <Divider />
      {data && chartOptions && <CardContent>

        {/*<Grid container spacing={3}>*/}
        {/*  {stats.map((item) => (*/}
        {/*    <Grid*/}
        {/*      item*/}
        {/*      key={item.label}*/}
        {/*      md={3}*/}
        {/*      sm={6}*/}
        {/*      xs={12}*/}
        {/*    >*/}
        {/*      <Box*/}
        {/*        sx={{*/}
        {/*          alignItems: 'center',*/}
        {/*          backgroundColor: 'neutral.100',*/}
        {/*          borderRadius: 1,*/}
        {/*          p: 2*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <Typography*/}
        {/*          color="textSecondary"*/}
        {/*          variant="overline"*/}
        {/*        >*/}
        {/*          {item.label}*/}
        {/*        </Typography>*/}
        {/*        <Typography*/}
        {/*          color="textPrimary"*/}
        {/*          variant="h6"*/}
        {/*        >*/}
        {/*          {item.content}*/}
        {/*        </Typography>*/}
        {/*      </Box>*/}
        {/*    </Grid>*/}
        {/*  ))}*/}
        {/*</Grid>*/}
        <Chart
          height={400}
          options={chartOptions}
          series={data.series}
          type="bar"
        />
      </CardContent>}
    </Card>
  );
};
