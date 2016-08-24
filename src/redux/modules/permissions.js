import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { mapReducers, parseResponseData, urlBase } from '../util'

const PERMISSIONS_FETCHED = 'PERMISSIONS_FETCHED'

export const initialState = fromJS({})

// REDUCERS

export function permissionsFetchSuccess(state, action) {
  return state.merge(fromJS(action.payload))
}

export function permissionsFetchFailure() {
  return fromJS({})
}

export default handleActions({
  PERMISSIONS_FETCHED: mapReducers(permissionsFetchSuccess, permissionsFetchFailure)
}, initialState)

// ACTIONS
export const fetchPermissions = createAction(PERMISSIONS_FETCHED, () => {
  return Promise.all([
    axios.get(`${urlBase}/v2/services/AAA`).then(parseResponseData),
    axios.get(`${urlBase}/v2/services/North`).then(parseResponseData),
    axios.get(`${urlBase}/v2/services/UI`).then(parseResponseData)
  ])
  .then(axios.spread((permissionsAAA, permissionsNorth, permissionsUI) => {
    return {
      aaa: permissionsAAA.resources,
      north: permissionsNorth.resources,
      ui: permissionsUI.resources
    }
  }))
})
