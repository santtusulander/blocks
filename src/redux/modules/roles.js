import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { mapReducers, parseResponseData, BASE_URL_AAA, PAGINATION_MOCK } from '../util'

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
    .then(parseResponseData ? parseResponseData.data : null)
    .then(roles => Promise.all(roles.map(role => {
      return axios.get(`${BASE_URL_AAA}/roles/${role.id}/services`)
        .then(parseResponseData)
        .then(roleServices => {
          const permissions = roleServices.reduce((permissions, roleService) => {
            const service = roleService.service.toLowerCase()
            permissions[service] = roleService.permissions.resources
            return permissions
          }, {})
          return { ...role, permissions }
        })
    })))
})
