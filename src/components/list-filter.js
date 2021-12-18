import { useState } from 'react';
import PropTypes from 'prop-types';
import {Box, Button, Divider, Tab, Tabs, ToggleButton, ToggleButtonGroup} from '@material-ui/core';
import { Adjustments as AdjustmentsIcon } from '../icons/adjustments';
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
} from '../utils/filter-operators';
import { FilterDialog } from './filter-dialog';
import { Query } from './query';
import { BulkActionsMenu } from "./bulk-actions-menu";
import {ViewList as ViewListIcon} from "../icons/view-list";
import {ViewGrid as ViewGridIcon} from "../icons/view-grid";

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
        selected,
        view,
        views,
        filterProperties
    } = props;
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

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
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Tabs>
                </Box>
                <Divider />
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            sm: selected.length > 0 ? 'auto 1fr auto' : '1fr auto',
                            xs: 'auto'
                        },
                        justifyItems: 'flex-start',
                        p: 3
                    }}
                >
                    <BulkActionsMenu
                        disabled={disabled}
                        onArchive={() => { }}
                        onDelete={() => { }}
                        selectedCount={selected.length}
                        sx={{
                            display: selected.length > 0 ? 'flex' : 'none',
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
                              sx={{ color: 'rgba(35, 45, 55, 0.38)' }}
                            />
                        </ToggleButton>
                        <ToggleButton value="dnd">
                            <ViewGridIcon
                              fontSize="small"
                              sx={{ color: 'rgba(35, 45, 55, 0.38)' }}
                            />
                        </ToggleButton>
                    </ToggleButtonGroup>)}
                    <Button
                        color="primary"
                        disabled={disabled}
                        onClick={() => setOpenFilterDialog(true)}
                        startIcon={<AdjustmentsIcon />}
                        size="large"
                        sx={{ order: 3 }}
                        variant={filters.length ? 'contained' : 'text'}
                    >
                        Filter
                    </Button>
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
    selected: [],
    view: 'all'
};

ListFilter.propTypes = {
    disabled: PropTypes.bool,
    filters: PropTypes.array,
    onFiltersApply: PropTypes.func,
    onFiltersClear: PropTypes.func,
    onQueryChange: PropTypes.func,
    onViewChange: PropTypes.func,
    query: PropTypes.string,
    selected: PropTypes.array,
    view: PropTypes.string
};
