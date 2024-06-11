import toast from 'react-hot-toast';
import { Card, CardContent, Grid } from '@material-ui/core';
import TrButton from "../../../components/common/translated/translated-button";
import {TrTypography} from "../../../components/common/translated/translated-typography";

export const Account2FA = () => {
  const handleActivate = () => {
    toast.success('Two-factor authentication activated');
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            md={5}
            xs={12}
          >
            <TrTypography
              color="textPrimary"
              variant="h6"
            >
              Two-factor authentication (2FA)
            </TrTypography>
            <TrTypography
              color="textSecondary"
              variant="body2"
            >
              Enhanced security for your mention account
            </TrTypography>
          </Grid>
          <Grid
            item
            md={7}
            xs={12}
          >
            <TrButton
              color="primary"
              onClick={handleActivate}
              size="large"
              variant="outlined"
            >
              Activate
            </TrButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
