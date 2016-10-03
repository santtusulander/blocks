import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { mapReducers, parseResponseData, BASE_URL_AAA } from '../util'

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
  return axios.get(`${BASE_URL_AAA}/roles`)
    .then(parseResponseData)
    .then(roles => Promise.all(roles.map(role => {
      return Promise.all([
        axios.get(`${BASE_URL_AAA}/roles/${role.id}/services/AAA`)
          .then(parseResponseData),
        axios.get(`${BASE_URL_AAA}/roles/${role.id}/services/North`)
          .then(parseResponseData),
        axios.get(`${BASE_URL_AAA}/roles/${role.id}/services/UI`)
          .then(parseResponseData)
      ])
      .then(axios.spread((permissionsAAA, permissionsNorth, permissionsUI) => {
        return {
          ...role,
          permissions: {
            aaa: permissionsAAA.permissions.resources,
            north: permissionsNorth.permissions.resources,
            ui: permissionsUI.permissions.resources
          }
        }
      }))
    })))
  // return Promise.resolve({data: [
  //   {id: 1, name: 'UDN Admin', parentRoles: [1], permissions: {
  //     resources: {
  //       content: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_traffic: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_unique_visitors: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_sp_contribution: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_file_error: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_url: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_sp_on_off_net: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       security: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       services: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       account: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       config: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       support: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       }
  //     }
  //   }},
  //   {id: 2, name: 'Content Provider', parentRoles: [2], permissions: {
  //     resources: {
  //       content: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_traffic: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_unique_visitors: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_sp_contribution: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_file_error: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_url: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_sp_on_off_net: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       security: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       services: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       account: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       config: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       support: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       }
  //     }
  //   }},
  //   {id: 3, name: 'Service Provider', parentRoles: [3], permissions: {
  //     resources: {
  //       content: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_traffic: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_unique_visitors: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_sp_contribution: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_file_error: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_cp_url: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       analytics_sp_on_off_net: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       security: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       services: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       account: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       config: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       },
  //       support: {
  //         list: {allowed: true},
  //         create: {allowed: true},
  //         show: {allowed: true},
  //         modify: {allowed: true},
  //         delete: {allowed: true}
  //       }
  //     }
  //   }}
  // ]})
})
