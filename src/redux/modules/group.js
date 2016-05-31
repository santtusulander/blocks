import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase, mapReducers} from '../util'

const GROUP_CREATED = 'GROUP_CREATED'
const GROUP_DELETED = 'GROUP_DELETED'
const GROUP_FETCHED = 'GROUP_FETCHED'
const GROUP_FETCHED_ALL = 'GROUP_FETCHED_ALL'
const GROUP_START_FETCH = 'GROUP_START_FETCH'
const GROUP_UPDATED = 'GROUP_UPDATED'
const ACTIVE_GROUP_CHANGED = 'ACTIVE_GROUP_CHANGED'

const emptyGroups = Immutable.Map({
  activeGroup: null,
  allGroups: Immutable.List(),
  fetching: false
})

// REDUCERS

export function createSuccess(state, action) {
  const newGroup = Immutable.fromJS(action.payload)
  return state.merge({
    activeGroup: newGroup,
    allGroups: state.get('allGroups').push(newGroup)
  })
}

export function deleteSuccess(state, action) {
  let newAllGroups = state.get('allGroups')
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
    fetching: false
  })
}

export function fetchSuccess(state, action) {
  return state.merge({
    activeGroup: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchFailure(state) {
  return state.merge({
    activeGroup: null,
    fetching: false
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

export function updateSuccess(state) {
  return state.merge({
    activeGroup: null,
    fetching: false
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

export const createGroup = createAction(GROUP_CREATED, (brand, account, name) => {
  console.log(brand, account, name)
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups`, {name: name}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteGroup = createAction(GROUP_DELETED, (brand, account, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchGroup = createAction(GROUP_FETCHED, (brand, account, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${id}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchGroups = createAction(GROUP_FETCHED_ALL, (brand, account) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateGroup = createAction(GROUP_UPDATED, (brand, account, group) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group.group_id}`, group, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if(res) {
      return group;
    }
  })
})

export const startFetching = createAction(GROUP_START_FETCH)

export const changeActiveGroup = createAction(ACTIVE_GROUP_CHANGED)
