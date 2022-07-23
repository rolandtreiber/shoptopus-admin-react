import React, {useContext} from 'react'
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Skeleton, Divider
} from "@material-ui/core";
import {Scrollbar} from "../scrollbar";
import {ResourceError} from "../resource-error";
import {ResourceUnavailable} from "../resource-unavailable";
import {Pagination} from "../pagination";
import {format} from "date-fns";
import {NotificationsContext} from "../../contexts/notifications-context";

const columns = [
  {
    id: 'icon',
    label: '',
    nonSortable: true
  },
  {
    id: 'type',
    label: 'Type',
    nonSortable: true
  },
  {
    id: 'data->message',
    label: 'Message'
  },
  {
    id: 'created_at',
    label: 'Created At'
  },
];

const NotificationsTable = (props) => {
  const {
    error,
    isLoading,
    onPageChange,
    onSortChange,
    page,
    pagesCount,
    data,
    sort,
    sortBy
  } = props;

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !data.length);
  const {notificationTypes} = useContext(NotificationsContext)[0]

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}
    >
      <Scrollbar>
        <Table sx={{minWidth: 800}}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sort : 'asc'}
                    disabled={isLoading}
                    onClick={(event) => onSortChange(event, column.id, column.translatable)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(notification => {
              const {icon: Icon, iconColor} = notificationTypes[notification.type]
              return (<TableRow
                  hover
                  key={notification.id}
                >
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      <Icon
                        fontSize="small"
                        sx={{ color: iconColor }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      {notificationTypes[notification.type].title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="body2"
                    >
                      {notification.data.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(notification.created_at), 'dd MMM yyyy HH:ii:ss')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {displayLoading && (
        <Box sx={{p: 2}}>
          <Skeleton height={42}/>
          <Skeleton height={42}/>
          <Skeleton height={42}/>
        </Box>
      )}
      {displayError && (
        <ResourceError
          error={error}
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      {displayUnavailable && (
        <ResourceUnavailable
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      <Divider sx={{mt: 'auto'}}/>
      <Pagination
        disabled={isLoading}
        onPageChange={onPageChange}
        page={page}
        pagesCount={pagesCount}
      />
    </Box>)
}

export default NotificationsTable