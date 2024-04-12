import {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Divider } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import RangeSelector from "./range-selector";
import TrCardHeader from "../../translated/TrCardHeader";

export const Timeline = ({data, title, onRangeChange}) => {
  const theme = useTheme();
  const [chartOptions, setChartOptions] = useState()

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

  // {/*<ActionsMenu*/}
  // {/*  actions={ranges}*/}
  // {/*  label={range}*/}
  // {/*  size="small"*/}
  // {/*  variant="text"*/}
  // {/*/>*/}


  return (
    <Card
      variant="outlined"
    >
      <TrCardHeader
        action={(
          <RangeSelector onChange={onRangeChange}/>
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
