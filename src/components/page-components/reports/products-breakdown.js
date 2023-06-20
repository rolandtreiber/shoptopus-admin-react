import {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { Box, Card, CardHeader, Divider, Tab, Tabs } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { ActionsMenu } from '../../common/actions/actions-menu';
import {useLanguage} from "../../../hooks/use-language";
import RangeSelector from "./range-selector";

export const ProductsBreakdown = ({data, categories, category, categoryUpdated, onRangeChange}) => {
  const theme = useTheme();
  const [range, setRange] = useState('Last 7 days');
  const [chartOptions, setChartOptions] = useState()
  const [chartSeries, setChartSeries] = useState()
  const {getLang} = useLanguage()

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

  const handleTabChange = (event, newValue) => {
    categoryUpdated(newValue)
  };

  useEffect(() => {
    if (data) {
      setChartOptions({
        chart: {
          background: 'transparent',
          toolbar: {
            show: false
          }
        },
        colors: data.series.map((item) => item.color),
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
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '45%',
            distributed: true
          }
        },
        theme: {
          mode: theme.palette.mode
        },
        legend: {
          show: false
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
          categories: data.categories.map(c => getLang(JSON.parse(c))),
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        }
      })
    }
  }, [data])

  useEffect(() => {
    !category && categories && categories.length > 0 && categoryUpdated(categories[0].id)
  }, [categories, category])

  useEffect(() => {
    if (chartOptions) {
      setChartSeries([{
        data: data.series.map((item) => item.data),
        label: 'hello'
      }]);
    }
  }, [chartOptions])

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%' }}
    >
      <CardHeader
        action={(
          <RangeSelector onChange={onRangeChange}/>
        )}
        title="ProductsList Breakdown"
      />
      {data && chartOptions && chartSeries && <>
      <Divider />
      <Box sx={{ px: 3 }}>
        {categories && <Tabs
          allowScrollButtonsMobile
          onChange={handleTabChange}
          value={category}
          variant="scrollable"
        >
          {categories.map(c => <Tab key={c.id} label={getLang(c.name)} value={c.id} />)}
        </Tabs>}
      </Box>
      <Divider />
      <Box sx={{ px: 2 }}>
        <Chart
          height="320"
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </Box>
      </>}
    </Card>
  );
};
