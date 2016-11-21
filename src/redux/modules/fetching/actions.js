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
export const createFetchingReducers = (actionTypes, prefix) => {
  let mappedActions = []
  Object.keys( actionTypes).forEach( actionType => {
    if (actionType === 'START_FETCHING') {
      mappedActions[`${prefix}/${actionType}`] = fetchingReducers.set
    } else {
      mappedActions[`${prefix}/${actionType}`] = fetchingReducers.clear
    }
  })

  return handleActions(mappedActions, false)
}
