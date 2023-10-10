import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Card, Chip, IconButton, Link } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { PropertyList } from '../../common/property-list/property-list';
import { PropertyListItem } from '../../common/property-list/property-list-item';
import { StatusBadge } from '../../common/status-badge';
import { OrderMenu } from './order-menu';
import {useContext} from "react";
import {SettingsContext} from "../../../contexts/settings-context";
import {useTranslation} from "react-i18next";

export const OrderDraggable = (props) => {
  const { badgeColor, index, order, ...other } = props;
  const {language} = useContext(SettingsContext)
  const { t } = useTranslation();

  return (
    <Draggable
      draggableId={order.id.toString()}
      index={index}
      {...other}
    >
      {(provided) => (
        <Card
          ref={provided.innerRef}
          sx={{
            minWidth: 360,
            mb: 2
          }}
          variant="outlined"
          {...provided.draggableProps}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              p: 2
            }}
          >
            <IconButton
              size="small"
              {...provided.dragHandleProps}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
            <Link
              color="textPrimary"
              component={RouterLink}
              sx={{
                ml: 1,
                mr: 2
              }}
              to={"/admin/orders/"+order.id}
              underline="none"
              variant="h5"
            >
              {`${order.slug}`}
            </Link>
            <StatusBadge color={badgeColor} />
            <Box sx={{ flexGrow: 1 }} />
            <OrderMenu order={order} />
          </Box>
          <PropertyList>
            <PropertyListItem
              label={t("Delivery Type")}
              align="horizontal"
            >
              <Chip
                label={order.delivery_type[language]}
                size="small"
              />
            </PropertyListItem>
            <PropertyListItem
              align="horizontal"
              label={t("Location")}
              value={`${order.town}`}
            />
            <PropertyListItem
              align="horizontal"
              label={t("Customer")}
              value={`${order.user}`}
            />
            <PropertyListItem
              align="horizontal"
              label={t("Price")}
              value={`${order.total_price}`}
            />
            <PropertyListItem
              align="horizontal"
              label={("Created At")}
              value={format(new Date(order.created_at), 'dd MMM yyyy HH:mm')}
            />
          </PropertyList>
        </Card>
      )}
    </Draggable>
  );
};

OrderDraggable.propTypes = {
  badgeColor: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  order: PropTypes.object.isRequired
};
