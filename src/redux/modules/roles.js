import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers } from '../util'

const ROLES_FETCHED = 'ROLES_FETCHED'

export const initialState = fromJS({
  roles: []
})

// REDUCERS

export function rolesFetchSuccess(state, action) {
  return state.set('roles', fromJS(action.payload.data))
}

export function rolesFetchFailure(state) {
  return state.set('roles', fromJS([]))
}

export default handleActions({
  ROLES_FETCHED: mapReducers(rolesFetchSuccess, rolesFetchFailure)
}, initialState)

// ACTIONS
export const fetchRoles = createAction(ROLES_FETCHED, () => {
  return Promise.resolve({data: [
    { id: 1, name: 'UDN', parentRoles: []  },
    { id: 2, name: 'Content Provider', parentRoles: [1, 2]  },
    { id: 3, name: 'Service Provider', parentRoles: [1]  }
  ]})
})
