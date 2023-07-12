import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem
} from '@material-ui/lab';
import {AccessAlarm, AirportShuttle, Check, Close, CreditCard, Link, Settings} from '@mui/icons-material';
import {format} from "date-fns";
import orderStatuses from "../../data/order-statuses.json"

export const OrderTimeline = (props) => {
  const { status, events, ...other } = props;


  const getOrderStatus = (statusId) => {
    const result = orderStatuses.filter(item => {
      return item.value === statusId
    })
    if (result.length > 0) {
      return result[0]
    }
    return null
  }

  const renderIcon = (status) => {
    switch (status) {
      case 1:
        return <AccessAlarm/>
      case 2:
        return <CreditCard/>
      case 3:
        return <Settings/>
      case 4:
        return <AirportShuttle/>
      case 5:
        return <Check/>
      case 6:
        return <AccessAlarm/>
      case 7:
        return <Close/>
      default:
        return <Link/>
    }
  }

  return (
    <Timeline
      sx={{
        my: 0,
        p: 0
      }}
      {...other}
    >
      {events.map((event, index) => (
        <Fragment key={event.message}>
          <TimelineItem
            sx={{
              alignItems: 'center',
              minHeight: 'auto',
              '&::before': {
                display: 'none'
              }
            }}
          >
            <TimelineDot
              sx={{
                backgroundColor: getOrderStatus(event.data.status) ? getOrderStatus(event.data.status).color : "success.main",
                borderColor: getOrderStatus(event.data.status) ? getOrderStatus(event.data.status).color : "success.main",
                color: 'success.contrastText',
                alignSelf: 'center',
                boxShadow: 'none',
                flexShrink: 0,
                height: 36,
                width: 36,
                m: 0
              }}
              variant={'filled'}
            >
              {renderIcon(event.data.status)}
            </TimelineDot>
            <TimelineContent>
              <Typography
                color={'textPrimary'}
                // color={(event.value === 'complete' || event.value === 'active')
                //   ? 'textPrimary'
                //   : 'textSecondary'}
                variant="overline"
              >
                {event.message}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  display: 'block'
                }}
                variant="caption"
              >
                {`${format(new Date(event.created_at), 'dd/MM/yyyy HH:mm')}`}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          {events.length > index + 1 && (
            <TimelineConnector
              sx={{
                backgroundColor: 'neutral.200',
                height: 22,
                ml: 2.25,
                my: 1
              }}
            />
          )}
        </Fragment>
      ))}
    </Timeline>
  );
};

OrderTimeline.propTypes = {
  status: PropTypes.number
};
