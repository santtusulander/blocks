import { initialState } from './index'

/* Pagination State Selectors */
export const getActivePage = ({ pagination }) => pagination.get('activePage');
export const getOffset = ({ pagination }) => pagination.get('offset');
export const getTotal = ({ pagination }) => pagination.get('total');
export const getPageSize = ({ pagination }) => pagination.get('page_size');
export const getSortBy = ({ pagination }) => pagination.get('sort_by');
export const getSortOrder = ({ pagination }) => pagination.get('sort_order');
export const getFilterBy = ({ pagination }) => pagination.get('filter_by');
export const getFilterValue = ({ pagination }) => pagination.get('filter_value');
export const getFields = ({ pagination }) => pagination.get('fields');
export const getStateStatus = ({ pagination }) => pagination === initialState;

export default (state) => ({
  offset: getOffset(state),
  page_size: getPageSize(state),
  sort_by: getSortBy(state),
  sort_order: getSortOrder(state),
  filter_by: getFilterBy(state),
  filter_value: getFilterValue(state),
  total: getTotal(state),
  activePage: getActivePage(state),
  fields: getFields(state),
  isPristine: getStateStatus(state)
});
