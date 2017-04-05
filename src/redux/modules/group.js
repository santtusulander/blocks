import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {BASE_URL_AAA, PAGINATION_MOCK, mapReducers} from '../util'
import { getServicePermissions } from '../../util/services-helpers'

const GROUP_CREATED = 'GROUP_CREATED'
const GROUP_DELETED = 'GROUP_DELETED'
const GROUP_FETCHED = 'GROUP_FETCHED'
const GROUP_FETCHED_ALL = 'GROUP_FETCHED_ALL'
const GROUP_START_FETCH = 'GROUP_START_FETCH'
const GROUP_UPDATED = 'GROUP_UPDATED'
const ACTIVE_GROUP_CHANGED = 'ACTIVE_GROUP_CHANGED'

const emptyGroups = Immutable.Map({
  activeGroup: undefined,
  allGroups: Immutable.List(),
  fetching: false,
  servicePermissions: Immutable.List()
})

// REDUCERS

export function createSuccess(state, action) {
  const newGroup = Immutable.fromJS(action.payload)
  return state.merge({
    activeGroup: newGroup,
    allGroups: state.get('allGroups').push(newGroup),
    servicePermissions: getServicePermissions(newGroup)
  })
}

export function deleteSuccess(state, action) {
  const newAllGroups = state.get('allGroups')
    .filterNot(group => {
      return group.get('id') === action.payload.id
    })
  return state.merge({
    allGroups: newAllGroups,
    fetching: false
  })
}

export function deleteFailure(state, action) {
  return state.merge({
    activeGroup: Immutable.fromJS(action.payload),
    fetching: false,
    servicePermissions: getServicePermissions(Immutable.fromJS(action.payload))
  })
}

export function fetchSuccess(state, action) {
  return state.merge({
    activeGroup: Immutable.fromJS(action.payload),
    fetching: false,
    servicePermissions: getServicePermissions(Immutable.fromJS(action.payload))
  })
}

export function fetchFailure(state) {
  return state.merge({
    activeGroup: null,
    fetching: false,
    servicePermissions: Immutable.List()
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allGroups: Immutable.fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allGroups: Immutable.List(),
    fetching: false
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function updateSuccess(state, action) {
  const updatedGroup = Immutable.fromJS(action.payload)
  const index = state.get('allGroups')
    .findIndex(group => group.get('id') === action.payload.id)
  const newAllGroups = state.get('allGroups').set(index, updatedGroup)
  return state.merge({
    activeGroup: updatedGroup,
    allGroups: newAllGroups,
    fetching: false,
    servicePermissions: getServicePermissions(updatedGroup)
  })
}

export function updateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function changeActive(state, action) {
  return state.set('activeGroup', action.payload)
}

export default handleActions({
  GROUP_CREATED: createSuccess,
  GROUP_DELETED: mapReducers(deleteSuccess, deleteFailure),
  GROUP_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  GROUP_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  GROUP_START_FETCH: startFetch,
  GROUP_UPDATED: mapReducers(updateSuccess, updateFailure),
  ACTIVE_GROUP_CHANGED: changeActive
}, emptyGroups)

// ACTIONS

export const createGroup = createAction(GROUP_CREATED, (brand, account, data) => {
  return axios.post(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (res) {
      return res.data;
    }
  })
})

export const deleteGroup = createAction(GROUP_DELETED, (brand, account, id) => {
  return axios.delete(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchGroup = createAction(GROUP_FETCHED, (brand, account, id) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${id}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchGroups = createAction(GROUP_FETCHED_ALL, (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`, PAGINATION_MOCK)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const updateGroup = createAction(GROUP_UPDATED, (brand, account, id, group) => {
  return axios.put(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${id}`, group, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (res) {
      return res.data;
    }
  })
})

export const startFetching = createAction(GROUP_START_FETCH)

export const changeActiveGroup = createAction(ACTIVE_GROUP_CHANGED)
