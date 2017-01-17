import { createAction } from 'redux-actions'

export const actionBase = 'pagination';

export const actionTypes = {
  SET_ACTIVE_PAGE: `${actionBase}/SET_ACTIVE_PAGE`,
  SET_TOTAL: `${actionBase}/SET_TOTAL`,
  SET_SORTING: `${actionBase}/SET_SORTING`,
  INVALIDATE: `${actionBase}/INVALIDATE`
};



export const setActivePage = createAction(actionTypes.SET_ACTIVE_PAGE, (page) => page);

export const setTotal = createAction(actionTypes.SET_TOTAL, (total) => total);

export const setSorting = createAction(actionTypes.SET_SORTING, (sortBy, sortOrder) => ({ sortBy, sortOrder }));

export const resetPaginationState = createAction(actionTypes.INVALIDATE);
