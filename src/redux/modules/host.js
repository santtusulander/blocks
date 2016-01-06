import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {defaultHeaders, urlBase} from '../util'

const CREATED = 'CREATED'
const DELETED = 'DELETED'
const FETCHED = 'FETCHED'
const FETCHED_ALL = 'FETCHED_ALL'
const START_FETCH = 'START_FETCH'
const UPDATED = 'UPDATED'
const ACTIVE_SERVICE_CHANGED = 'ACTIVE_SERVICE_CHANGED'

const emptyHost = Immutable.fromJS({
  edge_configuration: {
    published_name: "",
    origin_host_name: "",
    origin_host_port: "",
    host_header: "origin_host_name",
    origin_path_append: ""
  },
  response_policies: [
    {
      defaults: {
        match: "*",
        policies: [
          {
            type: "cache",
            action: "set",
            honor_origin_cache_policies: true
          },
          {
            type: "cache",
            action: "set",
            ignore_case: false
          },
          {
            type: "cache",
            action: "set",
            honor_etags: true
          },
          {
            type: "cache",
            action: "set",
            cache_errors: "10s"
          }
        ]
      }
    }
  ]
});

const emptyHosts = Immutable.Map({
  activeHost: emptyHost,
  allHosts: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  CREATED: {
    next(state, action) {
      const newHost = Immutable.fromJS(action.payload)
      return state.merge({
        activeHost: newHost,
        allHosts: state.get('allHosts').push(newHost)
      })
    }
  },
  DELETED: {
    next(state, action) {
      let newAllHosts = state.get('allHosts')
        .filterNot(host => {
          return host.get('summary').get('published_name') === action.payload.id
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
  FETCHED: {
    next(state, action) {
      return state.merge({
        activeHost: Immutable.fromJS(action.payload),
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
  FETCHED_ALL: {
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
  START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  UPDATED: {
    next(state, action) {
      const index = state.get('allHosts').findIndex(host => {
        return host.get('summary').get('published_name') === action.payload.id
      })
      let newHost = Immutable.fromJS(action.payload)
      return state.merge({
        activeHost: newHost,
        allHosts: state.get('allHosts').set(index, newHost),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  ACTIVE_SERVICE_CHANGED: (state, action) => {
    return state.set('activeHost', action.payload)
  }
}, emptyHosts)

// ACTIONS

export const createHost = createAction(CREATED, (brand, account, group) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteHost = createAction(DELETED, (brand, account, group, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: defaultHeaders
  })
  .then(() => {
    return {id: id}
  });
})

export const fetchHost = createAction(FETCHED, (brand, account, group, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchHosts = createAction(FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateHost = createAction(UPDATED, (brand, account, group, host) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${host.get('summary').get('published_name')}`, host, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const startFetching = createAction(START_FETCH)

export const changeActiveHost = createAction(ACTIVE_SERVICE_CHANGED)
