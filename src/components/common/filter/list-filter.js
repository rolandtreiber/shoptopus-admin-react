import {useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Divider, Tab, Tabs, ToggleButton, ToggleButtonGroup} from '@material-ui/core';
import {Adjustments as AdjustmentsIcon} from '../../../icons/adjustments';
import {
  containsOperator,
  endsWithOperator,
  equalOperator,
  greaterThanOperator,
  isAfterOperator,
  isBeforeOperator,
  isBlankOperator,
  isPresentOperator,
  lessThanOperator,
  notContainsOperator,
  notEqualOperator,
  startsWithOperator
} from '../../../utils/filter-operators';
import TrButton from "../translated/translated-button";
import {FilterDialog} from './filter-dialog';
import {Query} from './query';
import {BulkActionsMenu} from "../bulk-actions-menu";
import {ViewList as ViewListIcon} from "../../../icons/view-list";
import {ViewGrid as ViewGridIcon} from "../../../icons/view-grid";
import {useTranslation} from "react-i18next";

const filterOperators = [
  equalOperator,
  notEqualOperator,
  containsOperator,
  notContainsOperator,
  startsWithOperator,
  endsWithOperator,
  greaterThanOperator,
  lessThanOperator,
  isAfterOperator,
  isBeforeOperator,
  isBlankOperator,
  isPresentOperator
];

export const ListFilter = (props) => {
  const {
    disabled,
    filters,
    onFiltersApply,
    onFiltersClear,
    mode,
    onQueryChange,
    onModeChange,
    onViewChange,
    query,
    selectedElements,
    view,
    views,
    filterProperties,
    bulkMenuItems
  } = props;
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const { t } = useTranslation();

  const handleFiltersApply = (newFilters) => {
    const parsedFilters = newFilters.map((filter) => ({
      property: filter.property.name,
      value: filter.value,
      operator: filter.operator.value
    }));

    onFiltersApply({
      page: 0,
      filters: parsedFilters
    });
  };

  const handleFiltersClear = () => {
    onFiltersClear({
      page: 0,
      filters: []
    });
  };

  return (
    <>
      <div>
        <Box
          sx={{
            px: {
              sm: 3
            }
          }}
        >
          <Tabs
            onChange={(event, value) => onViewChange?.(value)}
            allowScrollButtonsMobile
            value={view}
            variant="scrollable"
          >
            {views.map((option) => (
              <Tab
                disabled={disabled}
                key={option.label}
                label={t(option.label)}
                value={option.value}
              />
            ))}
          </Tabs>
        </Box>
        <Divider/>
        <Box
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: selectedElements.length > 0 ? 'auto 1fr auto' : '1fr auto',
              xs: 'auto'
            },
            justifyItems: 'flex-start',
            p: 3
          }}
        >
          <BulkActionsMenu
            disabled={disabled}
            menuItems={bulkMenuItems}
            selectedCount={selectedElements.length}
            sx={{
              display: selectedElements.length > 0 ? 'flex' : 'none',
              order: {
                sm: 1,
                xs: 2
              }
            }}
          />
          <Query
            disabled={disabled}
            onChange={onQueryChange}
            sx={{
              order: {
                sm: 2,
                xs: 1
              }
            }}
            value={query}
          />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              order: 3
            }}
          >
            {mode !== null && mode !== undefined && (<ToggleButtonGroup
              exclusive
              onChange={onModeChange}
              size="small"
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 0.5,
                mr: 2,
                '& .MuiToggleButton-root': {
                  border: 0,
                  '&:not(:first-of-type)': {
                    borderRadius: 1
                  },
                  '&:first-of-type': {
                    borderRadius: 1,
                    mr: 0.5
                  }
                }
              }}
              value={mode}
            >
              <ToggleButton value="table">
                <ViewListIcon
                  fontSize="small"
                  sx={{color: 'rgba(35, 45, 55, 0.38)'}}
                />
              </ToggleButton>
              <ToggleButton value="dnd">
                <ViewGridIcon
                  fontSize="small"
                  sx={{color: 'rgba(35, 45, 55, 0.38)'}}
                />
              </ToggleButton>
            </ToggleButtonGroup>)}
            <TrButton
              color="primary"
              disabled={disabled}
              onClick={() => setOpenFilterDialog(true)}
              startIcon={<AdjustmentsIcon/>}
              size="large"
              sx={{order: 3}}
              variant={filters.length ? 'contained' : 'text'}
            >
              Filter
            </TrButton>
          </Box>
        </Box>
      </div>
      <FilterDialog
        onApply={handleFiltersApply}
        onClear={handleFiltersClear}
        onClose={() => setOpenFilterDialog(false)}
        open={openFilterDialog}
        operators={filterOperators}
        properties={filterProperties}
      />
    </>
  );
};

ListFilter.defaultProps = {
  filters: [],
  selectedElements: [],
  view: 'all'
};

ListFilter.propTypes = {
  mode: PropTypes.string,
  onModeChange: PropTypes.func,
  disabled: PropTypes.bool,
  filters: PropTypes.array,
  onFiltersApply: PropTypes.func,
  onFiltersClear: PropTypes.func,
  onQueryChange: PropTypes.func,
  onViewChange: PropTypes.func,
  query: PropTypes.string,
  selectedElements: PropTypes.array,
  view: PropTypes.string,
  views: PropTypes.array,
  filterProperties: PropTypes.array,
  bulkMenuItems: PropTypes.array
};
