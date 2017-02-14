import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import { SET_ACTIVE_PAGE, SET_TOTAL, SET_SORT_ORDER, SET_SORT_BY, SET_SORTING, SET_PAGE_SIZE, SET_FILTER_VALUE, SET_FILTER_BY, SET_FILTERING, SET_FIELDS, INVALIDATE  } from './actionTypes'

export const initialState = Map();

export default handleActions({
  [SET_ACTIVE_PAGE]: (state, { payload }) => state.merge(fromJS(payload)),
  [SET_TOTAL]: (state, { payload }) => state.set('total', payload),
  [SET_PAGE_SIZE]: (state, { payload }) => state.set('page_size', payload),

  [SET_SORT_BY]: (state, { payload }) => state.set('sort_by', payload),
  [SET_SORT_ORDER]: (state, { payload }) => state.set('sort_order', payload),
  [SET_SORTING]: (state, { payload }) => state.merge(fromJS(payload)),

  [SET_FILTER_BY]: (state, { payload }) => state.set('filter_by', payload),
  [SET_FILTER_VALUE]: (state, { payload }) => state.set('filer_value', payload),
  [SET_FILTERING]: (state, { payload }) => state.merge(fromJS(payload)),

  [SET_FIELDS]: (state, { payload }) => state.set('fields', payload),

  [INVALIDATE]: () => initialState
}, initialState);
