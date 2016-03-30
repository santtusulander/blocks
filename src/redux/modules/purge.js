import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase} from '../util'

const PURGE_CREATED = 'PURGE_CREATED'
const PURGE_FETCHED = 'PURGE_FETCHED'
const PURGE_FETCHED_ALL = 'PURGE_FETCHED_ALL'
const PURGE_START_FETCH = 'PURGE_START_FETCH'
const PURGE_RESET_ACTIVE = 'PURGE_RESET_ACTIVE'
const PURGE_UPDATE_ACTIVE = 'PURGE_UPDATE_ACTIVE'

const emptyPurges = Immutable.Map({
  activePurge: null,
  fetching: false,
  allPurges: Immutable.List()
})

const emptyPurge = Immutable.fromJS({
  action: 'purge',
  objects: [],
  note: '',
  feedback: null
})

// REDUCERS

export default handleActions({
  PURGE_CREATED: {
    next(state, action) {
      if(action.payload instanceof Error) {
        return state.merge({
          fetching: false
        })
      }
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
  },
  PURGE_RESET_ACTIVE: (state) => {
    return state.set('activePurge', emptyPurge)
  },
  PURGE_UPDATE_ACTIVE: (state, action) => {
    return state.set('activePurge', action.payload)
  }
}, emptyPurges)

// ACTIONS

export const createPurge = createAction(PURGE_CREATED, (brand, account, group, property, newPurge) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`, newPurge, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    return newPurge
  })
  .catch(res => {
    return new Error(res.data.message)
  })
})

export const fetchPurge = createAction(PURGE_FETCHED, (brand, account, group, property, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge/${id}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchAllPurges = createAction(PURGE_FETCHED_ALL, (brand, account, group, property) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(PURGE_START_FETCH)

export const resetActivePurge = createAction(PURGE_RESET_ACTIVE)

export const updateActivePurge = createAction(PURGE_UPDATE_ACTIVE)
