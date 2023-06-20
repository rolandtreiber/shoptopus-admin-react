import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Button, Container, Grid, Skeleton, Typography } from '@material-ui/core';
import { ActionsMenu } from '../../components/common/actions/actions-menu';
import { OrderInfo } from '../../components/order/order-info';
import { OrderInfoDialog } from '../../components/order/order-info-dialog';
import { OrderLineItems } from '../../components/order/order-line-items';
import { OrderPayment } from '../../components/order/order-payment';
import { OrderPaymentDialog } from '../../components/order/order-payment-dialog';
import { OrderStatus } from '../../components/order/order-status';
import { useMounted } from '../../hooks/use-mounted';
import { ArrowLeft as ArrowLeftIcon } from '../../icons/arrow-left';
import { ExclamationOutlined as ExclamationOutlinedIcon } from '../../icons/exclamation-outlined';
import gtm from '../../lib/gtm';
import {APIContext} from "../../contexts/api-context";
import NotesTriggerButton from "../../components/notes/notes-trigger-button";

export const OrderSingle = () => {
  const mounted = useMounted();
  const [orderState, setOrderState] = useState({ isLoading: true });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const {fetchOrder} = useContext(APIContext)
  const {orderId} = useParams()

  const getOrder = useCallback(async () => {
    setOrderState(() => ({ isLoading: true }));

    try {
      const result = await fetchOrder(orderId);

      if (mounted.current) {
        setOrderState(() => ({
          isLoading: false,
          data: result.data.data
        }));
        console.log(result.data.data)
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setOrderState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getOrder().catch(console.error);
  }, []);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleMark = () => {
    toast.error('This action is not available on demo');
  };

  const handleCancel = () => {
    toast.error('This action is not available on demo');
  };

  const handleDelete = () => {
    toast.error('This action is not available on demo');
  };

  const actions = [
    {
      label: 'Mark as Duplicate',
      onClick: handleMark
    },
    {
      label: 'Cancel OrderSingle',
      onClick: handleCancel
    },
    {
      label: 'Delete OrderSingle',
      onClick: handleDelete
    }
  ];

  const renderContent = () => {
    if (orderState.isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <Skeleton height={42} />
          <Skeleton />
          <Skeleton />
        </Box>
      );
    }

    if (orderState.error) {
      return (
        <Box sx={{ py: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <ExclamationOutlinedIcon />
            <Typography
              color="textSecondary"
              sx={{ mt: 2 }}
              variant="body2"
            >
              {orderState.error}
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
            {orderState.data && <NotesTriggerButton notes={orderState.data.notes} noteableId={orderId} noteableType={"order"} updatedCallback={{cb: getOrder}}/>}
            <Button
              color="primary"
              component={RouterLink}
              startIcon={<ArrowLeftIcon />}
              to="/orders"
              variant="text"
            >
              Orders
            </Button>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {`#${orderState.data.id}`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <ActionsMenu actions={actions} />
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid container item lg={8}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <OrderInfo
                onEdit={() => setOpenInfoDialog(true)}
                order={orderState.data}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              {orderState.data.payments.map(payment => <OrderPayment
                key={payment.id}
                onEdit={() => setOpenPaymentDialog(true)}
                payment={payment}
              />)}
            </Grid>
            <Grid
              item
              xs={12}
            >
              <OrderLineItems order={orderState.data} />
            </Grid>
          </Grid>
          <Grid container item lg={4}
            spacing={3}
            sx={{ height: 'fit-content' }}
            xs={12}
          >
            <Grid
              item
              xs={12}
            >
              <OrderStatus order={orderState.data} />
            </Grid>
          </Grid>
        </Grid>
        {/*<OrderInfoDialog*/}
        {/*  onClose={() => setOpenInfoDialog(false)}*/}
        {/*  open={openInfoDialog}*/}
        {/*  order={orderState.data}*/}
        {/*/>*/}
        {/*<OrderPaymentDialog*/}
        {/*  onClose={() => setOpenPaymentDialog(false)}*/}
        {/*  open={openPaymentDialog}*/}
        {/*  order={orderState.data}*/}
        {/*/>*/}
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Order: Details | Carpatin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {renderContent()}
        </Container>
      </Box>
    </>
  );
};
