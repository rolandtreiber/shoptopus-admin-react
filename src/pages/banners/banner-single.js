import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Container,
} from '@material-ui/core';
import TrButton from "../../components/common/translated/translated-button";
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import {BannerDetails} from "./components/banner-details";
import {Edit} from "@mui/icons-material";
import {BannerDialog} from "./components/banner-dialog";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const BannerSingle = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({ isLoading: true })
  const {fetchBanner} = useContext(APIContext)
  const {bannerId} = useParams()

  const fetchData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const result = await fetchBanner(bannerId)

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
        <title>Banners: List | {appName}</title>
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
              <TrButton
                color="primary"
                component={RouterLink}
                startIcon={<ArrowLeftIcon />}
                to="/admin/content/banners"
                variant="text"
              >
                Banners
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
                Banner
              </TrTypography>
              <Box sx={{flexGrow: 1}}/>
              <TrButton
                color="primary"
                onClick={() => setOpenEditDialog(true)}
                size="large"
                startIcon={<Edit fontSize="small"/>}
                variant="contained"
              >
                Edit
              </TrButton>
            </Box>
            {data.data && <BannerDetails data={data.data}/>}
          </Box>
          {data.data && <BannerDialog
            onClose={() => setOpenEditDialog(false)}
            open={openEditDialog}
            onSuccess={() => fetchData().catch(e => console.log(e.message))}
            initialValues={data.data}
          />}
        </Container>
      </Box>
    </>
  );
};
