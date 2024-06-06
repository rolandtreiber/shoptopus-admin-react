import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Container
} from '@material-ui/core';
import TrButton from "../../components/common/translated/translated-button";
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import {RatingDetails} from "./components/rating-details";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const RatingSingle = () => {
  const mounted = useMounted();
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({ isLoading: true })
  const {fetchRating} = useContext(APIContext)
  const {ratingId} = useParams()

  const fetchData = useCallback(async () => {
    setData(() => ({ isLoading: true }));

    try {
      const result = await fetchRating(ratingId)

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
        <title>Ratings: List | {appName}</title>
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
                to="/admin/ratings"
                variant="text"
              >
                Ratings
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
                Rating
              </TrTypography>
              <Box sx={{flexGrow: 1}}/>
            </Box>
            {data.data && <RatingDetails data={data}/>}
          </Box>
        </Container>
      </Box>
    </>
  );
};
