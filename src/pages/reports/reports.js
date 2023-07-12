import {useContext} from 'react';
import { Helmet } from 'react-helmet-async';
import {Box, Card, Container, Typography} from '@material-ui/core';
import {SettingsContext} from "../../contexts/settings-context";

export const Reports = () => {
  const {appName} = useContext(SettingsContext)

  return (
    <>
      <Helmet>
        <title>Reports | {appName}</title>
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
          <Box sx={{ py: 4 }}>
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
                Reports
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </Box>
          </Box>
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
          </Card>
        </Container>
      </Box>
    </>
  );
};
