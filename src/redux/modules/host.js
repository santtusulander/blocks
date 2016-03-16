import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase} from '../util'

const HOST_CREATED = 'HOST_CREATED'
const HOST_DELETED = 'HOST_DELETED'
const HOST_FETCHED = 'HOST_FETCHED'
const HOST_FETCHED_ALL = 'HOST_FETCHED_ALL'
const HOST_START_FETCH = 'HOST_START_FETCH'
const HOST_UPDATED = 'HOST_UPDATED'
const ACTIVE_HOST_CHANGED = 'ACTIVE_HOST_CHANGED'

const emptyHosts = Immutable.Map({
  activeHost: null,
  allHosts: Immutable.List(),
  fetching: false
})

const defaultPolicy = {policy_rules: [
  {
    set: {
      cache_control: {
        honor_origin: false,
        check_etag: false,
        max_age: 0
      }
    }
  },
  {
    set: {
      cache_name: {
        ignore_case: false
      }
    }
  }
]}

// REDUCERS

export default handleActions({
  HOST_CREATED: {
    next(state, action) {
      return state.merge({
        activeHost: null,
        allHosts: state.get('allHosts').push(action.payload)
      })
    }
  },
  HOST_DELETED: {
    next(state, action) {
      let newAllHosts = state.get('allHosts')
        .filterNot(host => {
          return host === action.payload.id
        })
      return state.merge({
        allHosts: newAllHosts,
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  HOST_FETCHED: {
    next(state, action) {
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
      return state.merge({
        activeHost: Immutable.fromJS(host),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activeHost: null,
        fetching: false
      })
    }
  },
  HOST_FETCHED_ALL: {
    next(state, action) {
      return state.merge({
        allHosts: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        allHosts: Immutable.List(),
        fetching: false
      })
    }
  },
  HOST_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  HOST_UPDATED: {
    next(state, action) {
      return state.merge({
        activeHost: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  ACTIVE_HOST_CHANGED: (state, action) => {
    return state.set('activeHost', action.payload)
  }
}, emptyHosts)

// ACTIONS

export const createHost = createAction(HOST_CREATED, (brand, account, group, id) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`,
    {
      services:[
        {
          service_type: "large",
          deployment_mode: "trial",
          configurations: [
            {
              edge_configuration: {
                published_name: id
              },
              configuration_status: {
                last_edited_by: "Test User"
              },
              default_policy: defaultPolicy
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
  .then((res) => {
    if(res) {
      return id;
    }
  })
})

export const deleteHost = createAction(HOST_DELETED, (brand, account, group, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchHost = createAction(HOST_FETCHED, (brand, account, group, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchHosts = createAction(HOST_FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateHost = createAction(HOST_UPDATED, (brand, account, group, id, host) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, host, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    return host;
  })
})

export const startFetching = createAction(HOST_START_FETCH)

export const changeActiveHost = createAction(ACTIVE_HOST_CHANGED)
