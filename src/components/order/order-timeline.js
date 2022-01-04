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
import { Check as CheckIcon } from '../../icons/check';
import {format} from "date-fns";

const getDotStyles = (value) => {
  if (value === 'complete') {
    return {
      backgroundColor: 'success.main',
      borderColor: 'success.main',
      color: 'success.contrastText'
    };
  }

  if (value === 'active') {
    return {
      backgroundColor: 'neutral.200',
      borderColor: 'neutral.200',
      color: 'text.secondary'
    };
  }

  return {
    backgroundColor: 'inherit',
    borderColor: 'neutral.300',
    color: 'text.secondary'
  };
};

// NOTE: Items should be generated on order data to display information such as ordered date
const getItems = (status) => {
  const statusMapping = ['placed', 'processed', 'delivered', 'complete'];
  const currentStatusIndex = statusMapping.indexOf(status) + 1;
  const items = [
    { title: 'Placed at 10/30/2021 03:16' },
    { title: 'Processed' },
    { title: 'Delivered' },
    { title: 'complete' }
  ];

  return items.map((item, index) => {
    if (currentStatusIndex > index) {
      return { ...item, value: 'complete' };
    }

    if (currentStatusIndex === index) {
      return { ...item, value: 'active' };
    }

    return { ...item, value: 'inactive' };
  });
};

export const OrderTimeline = (props) => {
  const { status, events, ...other } = props;
  const items = getItems(status);

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
                backgroundColor: 'success.main',
                borderColor: 'success.main',
                color: 'success.contrastText',
                alignSelf: 'center',
                boxShadow: 'none',
                flexShrink: 0,
                height: 36,
                width: 36,
                m: 0
              }}
              variant={'filled'}
              // variant={(event.value === 'complete' || event.value === 'active')
              //   ? 'filled'
              //   : 'outlined'}
            >
              <CheckIcon />
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
  status: PropTypes.oneOf(['placed', 'processed', 'delivered', 'complete']).isRequired
};
