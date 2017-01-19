import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import { actionTypes } from './actions'


const defaultPaginationState = Map({
  offset: 0,
  page_size: 3,
  total: 0
});


export default handleActions({
  [actionTypes.SET_ACTIVE_PAGE]: (state, { payload }) => state.set('offset', (payload - 1) * state.get('page_size')),
  [actionTypes.SET_TOTAL]: (state, { payload }) => state.set('total', payload),
  [actionTypes.SET_SORTING]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.SET_FILTER]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.INVALIDATE]: () => defaultPaginationState
}, defaultPaginationState);
