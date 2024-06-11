import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Box, Container, Skeleton, Typography } from '@material-ui/core';
import { invoiceApi } from '../../api/invoice';
import TrButton from "../../components/common/translated/translated-button";
import { InvoicePdfPreview } from './components/invoice-pdf-preview';
import { InvoicePDF } from './components/invoice-pdf';
import { useMounted } from '../../hooks/use-mounted';
import { ArrowLeft as ArrowLeftIcon } from '../../icons/arrow-left';
import { Download as DownloadIcon } from '../../icons/download';
import { ExclamationOutlined as ExclamationOutlinedIcon } from '../../icons/exclamation-outlined';
import gtm from '../../lib/gtm';
import {TrTypography} from "../../components/common/translated/translated-typography";

export const InvoicePreview = () => {
  const {appName} = useContext(SettingsContext)
  const mounted = useMounted();
  const [invoiceState, setInvoiceState] = useState({ isLoading: true });

  const getInvoice = useCallback(async () => {
    setInvoiceState(() => ({ isLoading: true }));

    try {
      const result = await invoiceApi.getInvoice();

      if (mounted.current) {
        setInvoiceState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setInvoiceState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getInvoice().catch(console.error);
  }, []);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const renderContent = () => {
    if (invoiceState.isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <Skeleton height={42} />
          <Skeleton />
          <Skeleton />
        </Box>
      );
    }

    if (invoiceState.error) {
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
              {invoiceState.error}
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <TrButton
              color="primary"
              component={RouterLink}
              startIcon={<ArrowLeftIcon />}
              to="/dashboard/invoices"
              variant="text"
            >
              Invoices
            </TrButton>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <TrTypography
              color="textPrimary"
              variant="h4"
            >
              Invoice Preview
            </TrTypography>
            <Box sx={{ flexGrow: 1 }} />
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoiceState.data} />}
              fileName="invoice"
              style={{ textDecoration: 'none' }}
            >
              <TrButton
                color="primary"
                startIcon={<DownloadIcon />}
                size="large"
                variant="contained"
              >
                Download
              </TrButton>
            </PDFDownloadLink>
          </Box>
        </Box>
        <InvoicePdfPreview invoice={invoiceState.data} />
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Invoice: Preview | {appName}</title>
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
