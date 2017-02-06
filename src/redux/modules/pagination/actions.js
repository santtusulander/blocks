import { createAction } from 'redux-actions'
import { SET_ACTIVE_PAGE, SET_TOTAL, SET_SORT_ORDER, SET_SORT_BY, SET_SORTING, SET_PAGE_SIZE, SET_FILTER_VALUE, SET_FILTER_BY, SET_FILTERING, INVALIDATE  } from './actionTypes'

export const setActivePage = createAction(SET_ACTIVE_PAGE, (page) => page);
export const setTotal = createAction(SET_TOTAL, (total) => total);
export const setPageSize = createAction(SET_PAGE_SIZE, (page_size) => page_size);
export const setSortOrder = createAction(SET_SORT_ORDER, (sort_order) => sort_order);
export const setSortBy = createAction(SET_SORT_BY, (sort_by) => sort_by);
export const setSorting = createAction(SET_SORTING, ({ sort_by, sort_order }) => ({ sort_by, sort_order }));
export const setFilterValue = createAction(SET_FILTER_VALUE, (filter_value) => filter_value);
export const setFilterBy = createAction(SET_FILTER_BY, (filter_by) => filter_by);
export const setFilter = createAction(SET_FILTERING, ({ filter_by, filter_value }) => ({ filter_by, filter_value }));
export const resetPaginationState = createAction(INVALIDATE);

export default {
  [SET_ACTIVE_PAGE]: setActivePage,
  [SET_TOTAL]: setTotal,
  [SET_PAGE_SIZE]: setPageSize,
  [SET_SORT_ORDER]: setSortOrder,
  [SET_SORT_BY]: setSortBy,
  [SET_SORTING]: setSorting,
  [SET_FILTER_VALUE]: setFilterValue,
  [SET_FILTER_BY]: setFilterBy,
  [SET_FILTERING]: setFilter,
  [INVALIDATE]: resetPaginationState
}
