import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {BASE_URL_NORTH, PAGINATION_MOCK, mapReducers, parseResponseData} from '../util'
import {getConfiguredName} from '../../util/helpers'

const HOST_CREATED = 'HOST_CREATED'
const HOST_DELETED = 'HOST_DELETED'
const HOST_FETCHED = 'HOST_FETCHED'
const HOST_FETCHED_ALL = 'HOST_FETCHED_ALL'
const HOST_NAMES_FETCHED_ALL = 'HOST_NAMES_FETCHED_ALL'
const HOST_START_FETCH = 'HOST_START_FETCH'
const HOST_UPDATED = 'HOST_UPDATED'
const ACTIVE_HOST_CHANGED = 'ACTIVE_HOST_CHANGED'
const HOST_CLEAR_FETCHED = 'HOST_CLEAR_FETCHED'

const emptyHosts = Immutable.Map({
  activeHost: undefined,
  activeHostConfiguredName: null,
  allHosts: Immutable.List(),
  configuredHostNames: Immutable.List(),
  fetching: false
})

// REDUCERS

export function createSuccess(state, { payload }) {
  return state.merge({
    activeHostConfiguredName: getConfiguredName(payload),
    activeHost: payload,
    allHosts: state.get('allHosts').push(payload.get('id')),
    configuredHostNames: state.get('configuredHostNames').push(getConfiguredName(payload))
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
  const allHosts = state.get('allHosts')
    .filterNot(property => property === action.payload.get('published_host_id'))
  const configuredHostNames = state.get('configuredHostNames')
    .filterNot(property => property === getConfiguredName(action.payload))
  return state.merge({
    allHosts,
    configuredHostNames,
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

export function fetchAllNamesSuccess(state, action) {
  return state.merge({
    configuredHostNames: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchAllNamesFailure(state) {
  return state.merge({
    configuredHostNames: Immutable.List(),
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
  return state.merge({
    'allHosts': Immutable.List(),
    'configuredHostNames': Immutable.List()
  })
}

export default handleActions({
  HOST_CREATED: mapReducers(createSuccess, createFailure),
  HOST_DELETED: mapReducers(deleteSuccess, deleteFailure),
  HOST_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  HOST_NAMES_FETCHED_ALL: mapReducers(fetchAllNamesSuccess, fetchAllNamesFailure),
  HOST_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  HOST_START_FETCH: startFetch,
  HOST_UPDATED: mapReducers(updateSuccess, updateFailure),
  ACTIVE_HOST_CHANGED: changeActive,
  HOST_CLEAR_FETCHED: clearFetched
}, emptyHosts)

// ACTIONS

export const createHost = createAction(HOST_CREATED, (brand, account, group, id, deploymentMode) => {
  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    services:[{
      service_type: "large",
      deployment_mode: deploymentMode,
      configurations: [{
        edge_configuration: {
          published_name: id
        },
        configuration_status: {
          last_edited_by: "Test User"
        }
      }]
    }]
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if(res) {
      return Immutable.fromJS(res.data).set('id', id)
    }
  })
})

export const deleteHost = createAction(HOST_DELETED, (brand, account, group, host) => {
  const id = host.get('published_host_id')
  return axios.delete(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then(() => {
    return host
  });
})

export const fetchHost = createAction(HOST_FETCHED, (brand, account, group, id) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then(parseResponseData);
})

export const fetchHosts = createAction(HOST_FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`, PAGINATION_MOCK)
  .then(parseResponseData);
})

export const fetchConfiguredHostNames = createAction(HOST_NAMES_FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`, PAGINATION_MOCK)
    .then(action => Promise.all(action.data.map(
      property => axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}`)
    )))
    .then(resp => resp.map(property => getConfiguredName(Immutable.fromJS(property.data))));
})

export const updateHost = createAction(HOST_UPDATED, (brand, account, group, id, host) => {
  return axios.put(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, host, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponseData)
})

export const startFetching = createAction(HOST_START_FETCH)
export const changeActiveHost = createAction(ACTIVE_HOST_CHANGED)
export const clearFetchedHosts = createAction(HOST_CLEAR_FETCHED)
