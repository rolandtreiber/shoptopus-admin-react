import {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { Card } from '@material-ui/core';
import { OrderDroppable } from './order-dropable';
import {APIContext} from "../../contexts/api-context";

const statusVariants = [
  {
    badgeColor: 'info.main',
    label: 'Awaiting Payment',
    value: 1
  },
  {
    badgeColor: 'info.main',
    label: 'Paid',
    value: 2
  },
  {
    badgeColor: 'warning.main',
    label: 'Processing',
    value: 3
  },
  {
    badgeColor: 'info.main',
    label: 'In Transit',
    value: 4
  },
  {
    badgeColor: 'success.main',
    label: 'Completed',
    value: 5
  },
  {
    badgeColor: 'warning.main',
    label: 'On Hold',
    value: 6
  },
  {
    badgeColor: 'error.main',
    label: 'Cancelled',
    value: 7
  }
];

const getColumns = (orders) => {
  const columns = {};

  statusVariants.forEach((variant) => {
    columns[variant.value] = orders.filter((order) => order.status === variant.value);
  });

  return columns;
};

const reorder = (source, startIndex, endIndex) => {
  const result = [...source];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = [...source];
  const destClone = [...destination];

  const [removed] = sourceClone.splice(droppableSource.index, 1);
  removed.status = droppableDestination.droppableId;
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return {
    columns: result,
    orderToUpdate: destClone[droppableDestination.index]
  };
};

export const OrdersDnd = (props) => {
  const { error, isLoading, orders, ...other } = props;
  const [columns, setColumns] = useState(null);
  const {updateOrder} = useContext(APIContext)

  const callUpdateApi = (id, newStatus) => {
    updateOrder(id, {
      status: newStatus
    })
  }

  // NOTE: This event should make a server request,
  //  update the order document with the new status on the server, then update the order data
  //  on client side
  const handleDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;


    if (sourceId === destinationId) {
      const items = reorder(columns[sourceId], source.index, destination.index);
      const newState = { ...columns };
      newState[sourceId] = items;
      setColumns(newState);
    } else {
      const result = move(columns[sourceId], columns[destinationId], source, destination);

      const orderToUpdate = result.orderToUpdate;
      callUpdateApi(orderToUpdate.id, orderToUpdate.status)

      const newState = { ...columns };
      newState[sourceId] = result.columns[sourceId];
      newState[destinationId] = result.columns[destinationId];

      setColumns(newState);
    }
  };

  useEffect(() => {
    setColumns(getColumns(orders));
  }, [orders]);

  if (!columns) {
    return null;
  }

  return (
    <Card
      sx={{
        backgroundColor: 'neutral.100',
        display: 'flex',
        flexGrow: 1,
        mb: 2,
        mx: 2,
        overflow: 'auto'
      }}
      variant="outlined"
      {...other}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        {statusVariants.map((option) => (
          <OrderDroppable
            badgeColor={option.badgeColor}
            id={option.value.toString()}
            orders={columns[option.value]}
            title={option.label}
            key={option.value}
          />
        ))}
      </DragDropContext>
    </Card>
  );
};

OrdersDnd.defaultProps = {
  orders: []
};

OrdersDnd.propTypes = {
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  orders: PropTypes.array
};
