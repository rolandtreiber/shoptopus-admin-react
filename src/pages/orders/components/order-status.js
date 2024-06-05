import {useCallback, useContext, useState} from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Card, CardContent, Divider, Typography } from '@material-ui/core';
import { useDialog } from '../../../hooks/use-dialog';
import { ConfirmationDialog } from '../../../components/common/modal/confirmation-dialog';
import { StatusSelect } from '../../../components/common/status-select';
import { OrderTimeline } from './order-timeline';
import {APIContext} from "../../../contexts/api-context";
import orderStatuses from "../../../data/order-statuses.json";
import {useTranslation} from "react-i18next";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const statusOptions = orderStatuses;

export const OrderStatus = (props) => {
  const { order, updated, ...other } = props;
  const [saveDialogOpen, handleOpenSaveMarkDialog, handleCloseSaveDialog] = useDialog();
  const [status, setStatus] = useState(order?.status || '');
  const [newStatus, setNewStatus] = useState(order?.status || '');
  const {updateOrder} = useContext(APIContext)
  const { t } = useTranslation();

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const doUpdateStatus = useCallback(async () => {
    try {
      const result = await updateOrder(order.id, {status: newStatus});
      result.data.data && toast.success('Changes saved');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  }, [newStatus]);

  const handleSave = () => {
    setStatus(newStatus);
    doUpdateStatus().then(() => updated()).catch(console.error);
    handleCloseSaveDialog()
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <TrCardHeader title={"Status and History"} />
        <Divider />
        <CardContent>
          {<StatusSelect
            onChange={handleStatusChange}
            options={statusOptions}
            value={newStatus}
          />}
          <Button
            color="primary"
            onClick={handleOpenSaveMarkDialog}
            sx={{ my: 2 }}
            variant="contained"
          >
            {t("Save Changes")}
          </Button>
          <Typography
            sx={{
              color: 'text.secondary',
              display: 'block'
            }}
            variant="caption"
          >
            {`${t("Updated")} ${format(new Date(order.updated_at), 'dd/MM/yyyy HH:mm')}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <OrderTimeline status={status} events={order.event_logs} />
        </CardContent>
      </Card>
      <ConfirmationDialog
        message={"Are you sure you want to update the status of this order?"}
        onCancel={handleCloseSaveDialog}
        onConfirm={handleSave}
        open={saveDialogOpen}
        title={"Update Order Status"}
        variant="info"
      />
    </>
  );
};

OrderStatus.propTypes = {
  order: PropTypes.object
};
