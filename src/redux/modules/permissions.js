import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers } from '../util'

const PERMISSIONS_FETCHED = 'PERMISSIONS_FETCHED'

export const initialState = fromJS({
  permissions: []
})

// REDUCERS

export function permissionsFetchSuccess(state, action) {
  return state.set('permissions', fromJS(action.payload.data))
}

export function permissionsFetchFailure(state) {
  return state.set('permissions', fromJS([]))
}

export default handleActions({
  PERMISSIONS_FETCHED: mapReducers(permissionsFetchSuccess, permissionsFetchFailure)
}, initialState)

// ACTIONS
export const fetchPermissions = createAction(PERMISSIONS_FETCHED, () => {
  return Promise.resolve({data: [
    {id: 1, name: 'Content'},
    {id: 2, name: 'Analytics'},
    {id: 3, name: 'Analytics: CP: Traffic'},
    {id: 4, name: 'Analytics: CP: Unique Visitors'},
    {id: 5, name: 'Analytics: CP: SP Contribution'},
    {id: 6, name: 'Analytics: CP: File Error'},
    {id: 7, name: 'Analytics: CP: URL'},
    {id: 8, name: 'Analytics: SP: On/Off Net'},
    {id: 9, name: 'Security'},
    {id: 10, name: 'Services'},
    {id: 11, name: 'Account'},
    {id: 12, name: 'Config'},
    {id: 13, name: 'Support'}
  ]})
})
