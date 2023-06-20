import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Card, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { useDialog } from '../../hooks/use-dialog';
import { Archive as ArchiveIcon } from '../../icons/archive';
import { CheckCircle as CheckCircleIcon } from '../../icons/check-circle';
import { Duplicate as DuplicateIcon } from '../../icons/duplicate';
import { ReceiptRefund as ReceiptRefundIcon } from '../../icons/receipt-refund';
import { ActionList } from '../common/actions/action-list';
import { ActionListItem } from '../common/actions/action-list-item';
import { ConfirmationDialog } from '../modal/confirmation-dialog';
import { StatusSelect } from '../common/status-select';
import { OrderTimeline } from './order-timeline';

const statusOptions = [
  {
    color: 'info.main',
    label: 'Paid',
    value: 1
  },
  {
    color: 'warning.main',
    label: 'Processing',
    value: 2
  },
  {
    color: 'info.main',
    label: 'In Transit',
    value: 3
  },
  {
    color: 'success.main',
    label: 'Completed',
    value: 4
  },
  {
    color: 'warning.main',
    label: 'On Hold',
    value: 5
  },
  {
    color: 'error.main',
    label: 'Cancelled',
    value: 6
  }
];

export const OrderStatus = (props) => {
  const { order, ...other } = props;
  const [markDialogOpen, handleOpenMarkDialog, handleCloseMarkDialog] = useDialog();
  const [duplicateDialogOpen, handleOpenDuplicateDialog, handleCloseDuplicateDialog] = useDialog();
  const [archiveDialogOpen, handleOpenArchiveDialog, handleCloseArchiveDialog] = useDialog();
  const [status, setStatus] = useState(order?.status || '');
  const [newStatus, setNewStatus] = useState(order?.status || '');

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleSaveChanges = () => {
    setStatus(newStatus);
    toast.success('Changes saved');
  };

  const handleMark = () => {
    handleCloseMarkDialog();
    toast.error('This action is not available on demo');
  };

  const handleDuplicate = () => {
    handleCloseDuplicateDialog();
    toast.error('This action is not available on demo');
  };

  const handleArchive = () => {
    handleCloseArchiveDialog();
    toast.error('This action is not available on demo');
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <CardHeader title="OrderSingle Status" />
        <Divider />
        <CardContent>
          <StatusSelect
            onChange={handleStatusChange}
            options={statusOptions}
            value={newStatus}
          />
          <Button
            color="primary"
            onClick={handleSaveChanges}
            sx={{ my: 2 }}
            variant="contained"
          >
            Save Changes
          </Button>
          <Typography
            sx={{
              color: 'text.secondary',
              display: 'block'
            }}
            variant="caption"
          >
            {`Updated ${format(new Date(order.updated_at), 'dd/MM/yyyy HH:mm')}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <OrderTimeline status={status} events={order.event_logs} />
        </CardContent>
        <Divider />
        <ActionList>
          <ActionListItem
            icon={CheckCircleIcon}
            label="Mark as Paid"
            onClick={handleOpenMarkDialog}
          />
          <ActionListItem
            icon={DuplicateIcon}
            label="Duplicate OrderSingle"
            onClick={handleOpenDuplicateDialog}
          />
          <ActionListItem
            disabled
            icon={ReceiptRefundIcon}
            label="Request a Refund"
          />
          <ActionListItem
            icon={ArchiveIcon}
            label="Archive OrderSingle"
            onClick={handleOpenArchiveDialog}
          />
        </ActionList>
      </Card>
      <ConfirmationDialog
        message="Are you sure you want to mark this order as paid? This can't be undone."
        onCancel={handleCloseMarkDialog}
        onConfirm={handleMark}
        open={markDialogOpen}
        title="Mark OrderSingle as paid"
        variant="info"
      />
      <ConfirmationDialog
        message="Are you sure you want to duplicate this order? This can't be undone."
        onCancel={handleCloseDuplicateDialog}
        onConfirm={handleDuplicate}
        open={duplicateDialogOpen}
        title="Duplicate OrderSingle"
        variant="warning"
      />
      <ConfirmationDialog
        message="Are you sure you want to archive this order? This can't be undone."
        onCancel={handleCloseArchiveDialog}
        onConfirm={handleArchive}
        open={archiveDialogOpen}
        title="Archive OrderSingle"
        variant="error"
      />
    </>
  );
};

OrderStatus.propTypes = {
  order: PropTypes.object
};
