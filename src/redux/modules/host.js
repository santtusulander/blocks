import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {defaultHeaders, urlBase} from '../util'

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

// REDUCERS

export default handleActions({
  HOST_CREATED: {
    next(state, action) {
      const newHost = Immutable.fromJS(action.payload)
      return state.merge({
        activeHost: newHost,
        allHosts: state.get('allHosts').push(newHost.get('published_host_id'))
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
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {}, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteHost = createAction(HOST_DELETED, (brand, account, group, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: defaultHeaders
  })
  .then(() => {
    return {id: id}
  });
})

export const fetchHost = createAction(HOST_FETCHED, (brand, account, group, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchHosts = createAction(HOST_FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateHost = createAction(HOST_UPDATED, (brand, account, group, host) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${host.published_host_id}`, host, {
    headers: defaultHeaders
  })
  .then(() => {
    return host;
  })
})

export const startFetching = createAction(HOST_START_FETCH)

export const changeActiveHost = createAction(ACTIVE_HOST_CHANGED)
