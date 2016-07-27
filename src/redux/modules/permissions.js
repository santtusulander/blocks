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
    {id: 'content', name: 'Content'},
    {id: 'analytics', name: 'Analytics'},
    {id: 'analytics_cp_traffic', name: 'Analytics: CP: Traffic'},
    {id: 'analytics_cp_unique_visitors', name: 'Analytics: CP: Unique Visitors'},
    {id: 'analytics_cp_sp_contribution', name: 'Analytics: CP: SP Contribution'},
    {id: 'analytics_cp_file_error', name: 'Analytics: CP: File Error'},
    {id: 'analytics_cp_url', name: 'Analytics: CP: URL'},
    {id: 'analytics_sp_on_off_net', name: 'Analytics: SP: On/Off Net'},
    {id: 'security', name: 'Security'},
    {id: 'services', name: 'Services'},
    {id: 'account', name: 'Account'},
    {id: 'config', name: 'Config'},
    {id: 'support', name: 'Support'}
  ]})
})
