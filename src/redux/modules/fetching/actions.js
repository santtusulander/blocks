import {handleActions} from 'redux-actions'
import * as fetchingReducers from './reducers'

/**
 * Utility to create 'fetching' -reducers
 * actionTypes array is used to define actions that set fetching to false
 *
 * @param actionTypes
 * @param prefix for actions
 * @returns {*}
 */
export const createFetchingReducers = (actionTypes) => {
  const mappedActions = {}

  for (const actionType in actionTypes) {
    if (actionType === 'REQUEST') mappedActions[ actionTypes[actionType] ] = fetchingReducers.set
    else  mappedActions[ actionTypes[actionType] ]= fetchingReducers.clear
  }

  return handleActions(mappedActions, false)
}
