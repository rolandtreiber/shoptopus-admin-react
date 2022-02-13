import {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListSubheader,
  Typography
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { ActionsMenu } from '../actions-menu';
import { StatusBadge } from '../status-badge';

export const PieChartBreakdown = (props) => {
  const {series, title} = props
  const theme = useTheme();
  const [range, setRange] = useState('Last 7 days');
  const [chartOptions, setChartOptions] = useState()
  const [chartSeries, setChartSeries] = useState()

  useEffect(() => {
    if (series) {
      setChartOptions({
        chart: {
          background: 'transparent'
        },
        colors: series.map((item) => item.color),
        dataLabels: {
          enabled: false
        },
        labels: series.map((item) => item.name),
        legend: {
          show: false
        },
        stroke: {
          show: false
        },
        theme: {
          mode: theme.palette.mode
        }
      })

      setChartSeries(series.map((item) => item.data));

    }
  }, [series])

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
      { series && chartOptions && chartSeries && <CardContent>
        <Chart
          height={200}
          options={chartOptions}
          series={chartSeries}
          type="donut"
        />
        <List>
          <ListSubheader
            disableGutters
            component="div"
            sx={{
              alignItems: 'center',
              display: 'flex',
              py: 1
            }}
          >
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Total
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {series.reduce((acc, currentValue) => acc + currentValue.data, 0)}
            </Typography>
          </ListSubheader>
          <Divider />
          {series.map((item, index) => (
            <ListItem
              disableGutters
              divider={series.length > index + 1}
              key={item.name}
              sx={{ display: 'flex' }}
            >
              <StatusBadge
                color={item.color}
                sx={{ mr: 1 }}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {item.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {item.data}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>}
    </Card>
  );
};
