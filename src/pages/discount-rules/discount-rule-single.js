import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container
} from '@material-ui/core';
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../../contexts/settings-context";
import {Pencil as PencilIcon} from "../../icons/pencil";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import DiscountRuleDetails from "./components/discount-rule-details";
import {DiscountRuleDialog} from "./components/discount-rule-dialog";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const DiscountRuleSingle = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({ isLoading: true })
  const {fetchDiscountRule} = useContext(APIContext)
  const {discountRuleId} = useParams()

  const onSuccess = () => {
    fetchData().catch(e => console.log(e.message))
  }

  const fetchData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const result = await fetchDiscountRule(discountRuleId)

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
        <title>Discount Rule: List | {appName}</title>
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
                to="/admin/discount/rules"
                variant="text"
              >
                Discount Rules
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
                Discount Rule
              </TrTypography>
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
            {data.data && <DiscountRuleDetails
              discountRule={data.data}
              onUpdated={(data) => setData({data:data, isLoading: false})}
            />}
          </Box>
        </Container>
        {data && <DiscountRuleDialog
            onClose={() => setOpenEditDialog(false)}
            open={openEditDialog}
            onSuccess={onSuccess}
            initialValues={data.data}
        />}
      </Box>
    </>
  );
};
