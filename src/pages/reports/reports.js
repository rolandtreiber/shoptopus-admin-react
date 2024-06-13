import {useContext} from 'react';
import { Helmet } from 'react-helmet-async';
import {Box, Card, Container} from '@material-ui/core';
import MissingPermission from "../../components/common-page-components/missing-permission/missing-permission";
import {AuthContext} from "../../contexts/oauth-context";
import {SettingsContext} from "../../contexts/settings-context";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const Reports = () => {
  const {appName} = useContext(SettingsContext)
  const {can} = useContext(AuthContext)

  return can('reports.can.see') ? (
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
              <TrTypography
                color="textPrimary"
                variant="h4"
              >
                Reports
              </TrTypography>
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
  ) : (<MissingPermission/>);
};
