import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { mapReducers, BASE_URL_AAA, PAGINATION_MOCK } from '../util'

const ROLES_FETCHED = 'ROLES_FETCHED'

export const initialState = fromJS({
  roles: []
})

// REDUCERS

export function rolesFetchSuccess(state, action) {
  return state.set('roles', fromJS(action.payload))
}

export function rolesFetchFailure(state) {
  return state.set('roles', fromJS([]))
}

export default handleActions({
  ROLES_FETCHED: mapReducers(rolesFetchSuccess, rolesFetchFailure)
}, initialState)

// ACTIONS
export const fetchRoles = createAction(ROLES_FETCHED, () => {
  return axios.get(`${BASE_URL_AAA}/roles`, PAGINATION_MOCK)
    .then(resp => resp.data.data)
    .then(roles => Promise.all(roles.map(role => {
      return axios.get(`${BASE_URL_AAA}/roles/${role.id}/services`, PAGINATION_MOCK)
        .then(resp => resp.data.data)
        .then(roleServices => {
          const permissions = roleServices.reduce((roleServicePermissions, roleService) => {
            const service = roleService.service.toLowerCase()
            roleServicePermissions[service] = roleService.permissions.resources
            return roleServicePermissions
          }, {})
          return { ...role, permissions }
        })
    })))
})
