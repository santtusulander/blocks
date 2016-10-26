import { createAction } from 'redux-actions'
import axios from 'axios'
import { handleActions } from 'redux-actions'
import Immutable from 'immutable'

import { BASE_URL_NORTH, mapReducers } from '../util'

const PURGE_CREATED = 'PURGE_CREATED'
const PURGE_FETCHED = 'PURGE_FETCHED'
const PURGE_FETCHED_ALL = 'PURGE_FETCHED_ALL'
const PURGE_START_FETCH = 'PURGE_START_FETCH'
const PURGE_RESET_ACTIVE = 'PURGE_RESET_ACTIVE'
const PURGE_UPDATE_ACTIVE = 'PURGE_UPDATE_ACTIVE'

export const emptyPurges = Immutable.Map({
  activePurge: null,
  fetching: false,
  allPurges: Immutable.List()
})

export const emptyPurge = Immutable.fromJS({
  action: 'purge',
  objects: [],
  note: '',
  feedback: null
})

// REDUCERS

export function createRequestSuccess(state, action) {
  if(action.payload instanceof Error) {
    return state.merge({
      fetching: false
    })
  }
  return state.merge({
    activePurge: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function createFailure(state) {
  return state.merge({
    activePurge: null,
    fetching: false
  })
}

export function fetchSuccess(state, action) {
  return state.merge({
    activePurge: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchFailure(state) {
  return state.merge({
    activePurge: null,
    fetching: false
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allPurges: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allPurges: Immutable.List(),
    fetching: false
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function resetActive(state) {
  return state.set('activePurge', emptyPurge)
}

export function updateActive(state, action) {
  return state.set('activePurge', action.payload)
}

export default handleActions({
  PURGE_CREATED: mapReducers(createRequestSuccess, createFailure),
  PURGE_FETCHED: mapReducers(fetchAllSuccess, fetchFailure),
  PURGE_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  PURGE_START_FETCH: startFetch,
  PURGE_RESET_ACTIVE: resetActive,
  PURGE_UPDATE_ACTIVE: updateActive
}, emptyPurges)

// ACTIONS

export const createPurge = createAction(PURGE_CREATED, (brand, account, group, property, newPurge) => {
  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`, newPurge, {
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
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge/${id}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchAllPurges = createAction(PURGE_FETCHED_ALL, (brand, account, group, property) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(PURGE_START_FETCH)

export const resetActivePurge = createAction(PURGE_RESET_ACTIVE)

export const updateActivePurge = createAction(PURGE_UPDATE_ACTIVE)
