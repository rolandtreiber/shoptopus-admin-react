import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container,
  Typography
} from '@material-ui/core';
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {Pencil as PencilIcon} from "../../icons/pencil";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import VoucherCodeDetails from "../../components/page-components/voucher-codes/voucher-code-details";
import {VoucherCodeDialog} from "../../components/page-components/voucher-codes/voucher-code-dialog";

export const VoucherCodeSingle = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({ isLoading: true })
  const {fetchVoucherCode} = useContext(APIContext)
  const {voucherCodeId} = useParams()

  const onSuccess = () => {
    fetchData().catch(e => console.log(e.message))
  }

  const fetchData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const result = await fetchVoucherCode(voucherCodeId)

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          data: result.data.data,
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
      fetchData().catch(e => console.log(e.message))
  }, [])

  return (
    <>
      <Helmet>
        <title>Voucher Code | {appName}</title>
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
          <Box sx={{py: 4}}>
            <Box sx={{ mb: 2 }}>
              <Button
                color="primary"
                component={RouterLink}
                startIcon={<ArrowLeftIcon />}
                to="/discount/voucher-codes"
                variant="text"
              >
                Voucher Codes
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
                Voucher Code
              </Typography>
              <Box sx={{flexGrow: 1}}/>
              <Button
                color="primary"
                onClick={() => setOpenEditDialog(true)}
                size="large"
                startIcon={<PencilIcon fontSize="small"/>}
                variant="contained"
              >
                Edit
              </Button>
            </Box>
            {data.data && <VoucherCodeDetails onEdit={() => setOpenEditDialog(true)} voucherCode={data.data}/>}
          </Box>
        </Container>
        {data && <VoucherCodeDialog
            onClose={() => setOpenEditDialog(false)}
            open={openEditDialog}
            onSuccess={onSuccess}
            initialValues={data.data}
        />}
      </Box>
    </>
  );
};
