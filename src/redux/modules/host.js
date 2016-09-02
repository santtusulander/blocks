import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase, mapReducers, parseResponseData} from '../util'
import {getConfiguredName} from '../../util/helpers'

const HOST_CREATED = 'HOST_CREATED'
const HOST_DELETED = 'HOST_DELETED'
const HOST_FETCHED = 'HOST_FETCHED'
const HOST_FETCHED_ALL = 'HOST_FETCHED_ALL'
const HOST_START_FETCH = 'HOST_START_FETCH'
const HOST_UPDATED = 'HOST_UPDATED'
const ACTIVE_HOST_CHANGED = 'ACTIVE_HOST_CHANGED'
const HOST_CLEAR_FETCHED = 'HOST_CLEAR_FETCHED'

const emptyHosts = Immutable.Map({
  activeHost: undefined,
  activeHostConfiguredName: null,
  allHosts: Immutable.List(),
  fetching: false
})

// REDUCERS

export function createSuccess(state, { payload }) {
  return state.merge({
    activeHostConfiguredName: getConfiguredName(payload),
    activeHost: payload,
    allHosts: state.get('allHosts').push(payload.get('id'))
  })
}

export function createFailure(state) {
  return state.merge({
    activeHostConfiguredName: null,
    activeHost: null,
    fetching: false
  })
}

export function deleteSuccess(state, action) {
  let newAllHosts = state.get('allHosts')
    .filterNot(group => {
      return group === action.payload.id
    })
  return state.merge({
    allHosts: newAllHosts,
    fetching: false
  })
}

export function deleteFailure(state, action) {
  return state.merge({
    activeHost: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchSuccess(state, action) {
  let host = action.payload
  host.services[0].configurations = host.services[0].configurations.map(config => {
    if(!config.default_policy || !config.default_policy.policy_rules) {
      config.default_policy = {policy_rules:[]}
    }
    if(!config.request_policy || !config.request_policy.policy_rules) {
      config.request_policy = {policy_rules:[]}
    }
    if(!config.response_policy || !config.response_policy.policy_rules) {
      config.response_policy = {policy_rules:[]}
    }
    return config;
  })
  if(!host.services[0].active_configurations) {
    host.services[0].active_configurations = []
  }
  const newActive = Immutable.fromJS(host)
  return state.merge({
    activeHostConfiguredName: getConfiguredName(newActive),
    activeHost: newActive,
    fetching: false
  })
}

export function fetchFailure(state) {
  return state.merge({
    activeHostConfiguredName: null,
    activeHost: null,
    fetching: false
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allHosts: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allHosts: Immutable.List(),
    fetching: false
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function updateSuccess(state, action) {
  const newActive = Immutable.fromJS(action.payload)
  return state.merge({
    activeHostConfiguredName: getConfiguredName(newActive),
    activeHost: newActive,
    fetching: false
  })
}

export function updateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function changeActive(state, action) {
  return state.merge({
    activeHostConfiguredName: getConfiguredName(action.payload),
    activeHost: action.payload
  })
}

export function clearFetched(state) {
  return state.set('allHosts', Immutable.List())
}

export default handleActions({
  HOST_CREATED: mapReducers(createSuccess, createFailure),
  HOST_DELETED: mapReducers(deleteSuccess, deleteFailure),
  HOST_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  HOST_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  HOST_START_FETCH: startFetch,
  HOST_UPDATED: mapReducers(updateSuccess, updateFailure),
  ACTIVE_HOST_CHANGED: changeActive,
  HOST_CLEAR_FETCHED: clearFetched
}, emptyHosts)

// ACTIONS

export const createHost = createAction(HOST_CREATED, (brand, account, group, id, deploymentMode) => {
  return axios.post(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`,
    {
      services:[
        {
          service_type: "large",
          deployment_mode: deploymentMode,
          configurations: [
            {
              edge_configuration: {
                published_name: id
              },
              configuration_status: {
                last_edited_by: "Test User"
              }
            }
          ]
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then(res => {
    if(res) {
      return Immutable.fromJS(res.data).set('id', id)
    }
  })
})

export const deleteHost = createAction(HOST_DELETED, (brand, account, group, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchHost = createAction(HOST_FETCHED, (brand, account, group, id) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then(parseResponseData);
})

export const fetchHosts = createAction(HOST_FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)
  .then(parseResponseData);
})

export const updateHost = createAction(HOST_UPDATED, (brand, account, group, id, host) => {
  return axios.put(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, host, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponseData)
})

export const startFetching = createAction(HOST_START_FETCH)
export const changeActiveHost = createAction(ACTIVE_HOST_CHANGED)
export const clearFetchedHosts = createAction(HOST_CLEAR_FETCHED)
