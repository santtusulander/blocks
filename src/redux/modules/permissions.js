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
    {id: 2, name: 'CP Analytics'},
    {id: 3, name: 'SP Analytics'},
    {id: 4, name: 'Security'},
    {id: 5, name: 'Services'},
    {id: 6, name: 'Account'},
    {id: 7, name: 'Config'},
    {id: 8, name: 'Support'}
  ]})
})
