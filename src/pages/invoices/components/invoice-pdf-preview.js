import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Card, Paper, Typography } from '@material-ui/core';
import { InvoiceTable } from './invoice-table';
import {TrTypography} from "../../../components/common/translated/translated-typography";

export const InvoicePdfPreview = (props) => {
  const { invoice } = props;

  return (
    <Paper
      elevation={24}
      sx={{ p: 3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          color="textPrimary"
          variant="h4"
        >
          #
          {invoice.id}
        </Typography>
        <TrTypography
          align="right"
          color="error.main"
          sx={{ textTransform: 'uppercase' }}
          variant="h4"
        >
          {invoice.status}
        </TrTypography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: {
            md: 'space-between',
            xs: 'flex-start'
          },
          flexDirection: {
            md: 'row',
            xs: 'column'
          },
          mt: 1.5
        }}
      >
        <div>
          <TrTypography
            color="textPrimary"
            gutterBottom
            variant="subtitle2"
          >
            Invoice to
          </TrTypography>
          <TrTypography
            color="textSecondary"
            variant="body2"
          >
            Acme LTD GB54423345
            <br />
            340 Lemon St. #5554
            <br />
            Spring Valley, California
            <br />
            United States
          </TrTypography>
        </div>
        <Box
          sx={{
            textAlign: {
              md: 'right',
              xs: 'left'
            }
          }}
        >
          <TrTypography
            color="textPrimary"
            gutterBottom
            variant="subtitle2"
          >
            Invoice for
          </TrTypography>
          <TrTypography
            color="textSecondary"
            variant="body2"
          >
            Natalie Rusell
            <br />
            3845 Salty Street
            <br />
            Salt Lake City
            <br />
            United States
          </TrTypography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 6
        }}
      >
        <Box>
          <TrTypography
            color="textPrimary"
            gutterBottom
            variant="subtitle2"
          >
            Invoice Date
          </TrTypography>
          <TrTypography
            color="textSecondary"
            variant="body2"
          >
            {format(invoice.issueDate, 'dd MMM yyyy')}
          </TrTypography>
        </Box>
        <Box>
          <TrTypography
            align="right"
            color="textPrimary"
            gutterBottom
            variant="subtitle2"
          >
            Due Date
          </TrTypography>
          <TrTypography
            align="right"
            color="textSecondary"
            variant="body2"
          >
            {format(invoice.dueDate, 'dd MMM yyyy')}
          </TrTypography>
        </Box>
      </Box>
      <Card
        variant="outlined"
        sx={{ my: 4.5 }}
      >
        <InvoiceTable invoice={invoice} />
      </Card>
      <TrTypography
        color="textPrimary"
        gutterBottom
        variant="subtitle2"
      >
        Notes
      </TrTypography>
      <TrTypography
        color="textsecondary"
        variant="body2"
      >
        “
        {invoice.note}
        ”
      </TrTypography>
    </Paper>
  );
};

InvoicePdfPreview.propTypes = {
  invoice: PropTypes.object.isRequired
};
