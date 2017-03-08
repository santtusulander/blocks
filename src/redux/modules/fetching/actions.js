import {handleActions} from 'redux-actions'
import { Map } from 'immutable'

import * as fetchingReducers from './reducers'

/**
 * Utility function mapping actions to reducers that set or clear fetching-flag.
 * @param  {[object]} actionTypes [actions to listen to - the one keyed 'REQUEST' is mapped to a reducer that sets fetching, others are mapped to a clearing one]
 * @return {[function]} reducer [a single reducer that handles multiple actions]
 */
export default (actionTypes) => {
  const mappedActions = {}

  for (const actionType in actionTypes) {
    if (actionType === 'REQUEST') mappedActions[ actionTypes[actionType] ] = fetchingReducers.set
    else  mappedActions[ actionTypes[actionType] ]= fetchingReducers.clear
  }

  return handleActions(mappedActions, Map())
}
