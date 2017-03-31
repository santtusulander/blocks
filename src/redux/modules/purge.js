import { createAction } from 'redux-actions'
import axios from 'axios'
import { handleActions } from 'redux-actions'
import Immutable from 'immutable'

import { BASE_URL_NORTH, mapReducers } from '../util'

const PURGE_CREATED = 'PURGE_CREATED'
const PURGE_FETCHED = 'PURGE_FETCHED'
const PURGE_LIST_FETCHED = 'PURGE_LIST_FETCHED'
const PURGE_OBJECTS_FETCHED = 'PURGE_OBJECTS_FETCHED'
const PURGE_START_FETCH = 'PURGE_START_FETCH'
const PURGE_RESET_ACTIVE = 'PURGE_RESET_ACTIVE'
const PURGE_UPDATE_ACTIVE = 'PURGE_UPDATE_ACTIVE'

export const emptyPurges = Immutable.Map({
  activePurge: null,
  fetching: false,
  purgeList: Immutable.List(),
  purgeObjects: Immutable.List()
})

export const emptyPurge = Immutable.fromJS({
  action: 'purge',
  objects: [],
  note: ''
})

// REDUCERS

export function createRequestSuccess(state, action) {
  if (action.payload instanceof Error) {
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

export function fetchListSuccess(state, action) {
  return state.merge({
    purgeList: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchListFailure(state) {
  return state.merge({
    purgeList: Immutable.List(),
    fetching: false
  })
}

export function fetchObjectsSuccess(state, action) {
  return state.merge({
    purgeObjects: Immutable.fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchObjectsFailure(state) {
  return state.merge({
    purgeObjects: Immutable.List(),
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
  PURGE_FETCHED: mapReducers(fetchListSuccess, fetchFailure),
  PURGE_LIST_FETCHED: mapReducers(fetchListSuccess, fetchListFailure),
  PURGE_OBJECTS_FETCHED: mapReducers(fetchObjectsSuccess, fetchObjectsFailure),
  PURGE_START_FETCH: startFetch,
  PURGE_RESET_ACTIVE: resetActive,
  PURGE_UPDATE_ACTIVE: updateActive
}, emptyPurges)

// ACTIONS

export const createPurge = createAction(PURGE_CREATED, (brand, account, group, property, newPurge) => {
  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/purge_many`, newPurge, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => ({ ...newPurge, ...res.data }))
  .catch(res => {
    return new Error(res.data.message)
  })
})

export const fetchPurge = createAction(PURGE_FETCHED, (brand, account, group, property, id) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge/${id}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchPurgeList = createAction(PURGE_LIST_FETCHED, (brand, account, group, property) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/purge`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchPurgeObjects = createAction(PURGE_OBJECTS_FETCHED, (brand, account, group, params = {}) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/purge_many`, { params })
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(PURGE_START_FETCH)

export const resetActivePurge = createAction(PURGE_RESET_ACTIVE)

export const updateActivePurge = createAction(PURGE_UPDATE_ACTIVE)
