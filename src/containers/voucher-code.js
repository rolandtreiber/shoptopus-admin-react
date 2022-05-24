import React, {useContext, useState} from 'react';
import {
  Box,
  Button,
  Container,
  Typography
} from '@material-ui/core';
import {useMounted} from '../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {Plus as PlusIcon} from "../icons/plus";
import {SettingsContext} from "../contexts/settings-context";
import {Link as RouterLink} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../icons/arrow-left";

export const VoucherCode = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {language, appName} = useContext(SettingsContext)

  return (
    <>
      <Helmet>
        <title>Voucher Code: List | {appName}</title>
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
                startIcon={<PlusIcon fontSize="small"/>}
                variant="contained"
              >
                Edit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};
