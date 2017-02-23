import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { RECEIVE, REQUEST, FAIL } from './actions'
import mapActionsToFetchingReducers from '../../fetching/actions'

const codes = handleActions({
  [RECEIVE]: (state, action) => action.response.data,
  [FAIL]: state => state
}, [])

export default combineReducers({
  codes,
  fetching: mapActionsToFetchingReducers({ RECEIVE, REQUEST, FAIL })
})
