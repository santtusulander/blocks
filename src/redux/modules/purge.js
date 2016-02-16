import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {defaultHeaders, urlBase} from '../util'

const PURGE_CREATED = 'PURGE_CREATED'
const PURGE_FETCHED = 'PURGE_FETCHED'
const PURGE_FETCHED_ALL = 'PURGE_FETCHED_ALL'
const PURGE_START_FETCH = 'PURGE_START_FETCH'

const emptyPurges = Immutable.Map({
  activePurge: null,
  fetching: false,
  allPurges: Immutable.List()
})

// REDUCERS

export default handleActions({
  PURGE_CREATED: {
    next(state, action) {
      return state.merge({
        activePurge: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activePurge: null,
        fetching: false
      })
    }
  },
  PURGE_FETCHED: {
    next(state, action) {
      return state.merge({
        activePurge: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activePurge: null,
        fetching: false
      })
    }
  },
  PURGE_FETCHED_ALL: {
    next(state, action) {
      return state.merge({
        allPurges: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        allPurges: Immutable.List(),
        fetching: false
      })
    }
  },
  PURGE_START_FETCH: (state) => {
    return state.set('fetching', true)
  }
}, emptyPurges)

// ACTIONS

export const createPurge = createAction(PURGE_CREATED, (brand, account, group, property, newPurge) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`, newPurge, {
    headers: defaultHeaders
  })
  .then(() => newPurge);
})

export const fetchPurge = createAction(PURGE_FETCHED, (brand, account, group, property, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge/${id}`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchAllPurges = createAction(PURGE_FETCHED_ALL, (brand, account, group, property) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(PURGE_START_FETCH)
