import {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container
} from '@material-ui/core';
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {Plus as PlusIcon} from "../../icons/plus";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import TransactionDetails from "./components/transaction-details";
import {ResourceLoading} from "../../components/common/placeholder/resource-loading";
import {ResourceError} from "../../components/common/placeholder/resource-error";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const TransactionSingle = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({ isLoading: true })
  const {fetchPayment} = useContext(APIContext)
  const {transactionId} = useParams()

  const fetchData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const result = await fetchPayment(transactionId)

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
        <title>Transaction: List | {appName}</title>
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
                to="/admin/transactions"
                variant="text"
              >
                Transactions
              </Button>
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
                Transaction
              </TrTypography>
              <Box sx={{flexGrow: 1}}/>
              <Button
                color="primary"
                onClick={() => setOpenEditDialog(true)}
                size="large"
                startIcon={<PlusIcon fontSize="small"/>}
                variant="contained"
              >
                Partial refund
              </Button>
            </Box>
            {openEditDialog && <Fragment></Fragment>}
            {data.data && <TransactionDetails transaction={data.data}/>}
            {data.isLoading && <ResourceLoading/>}
            {data.error && <ResourceError/>}
          </Box>
        </Container>
      </Box>
    </>
  );
};
