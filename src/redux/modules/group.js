import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {acceptJSON, urlBase} from '../util'

const CREATED = 'CREATED'
const DELETED = 'DELETED'
const FETCHED = 'FETCHED'
const FETCHED_ALL = 'FETCHED_ALL'
const START_FETCH = 'START_FETCH'
const UPDATED = 'UPDATED'

const emptyGroups = Immutable.Map({
  activeGroup: null,
  allGroups: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  CREATED: {
    next(state, action) {
      const newGroup = Immutable.fromJS(action.payload)
      return state.merge({
        activeGroup: newGroup,
        allGroups: state.get('allGroups').push(newGroup)
      })
    }
  },
  DELETED: {
    next(state, action) {
      let newAllGroups = state.get('allGroups')
        .filterNot(group => {
          return group.get('id') === action.payload.id
        })
      return state.merge({
        allGroups: newAllGroups,
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
        activeGroup: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activeGroup: null,
        fetching: false
      })
    }
  },
  FETCHED_ALL: {
    next(state, action) {
      return state.merge({
        allGroups: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        allGroups: Immutable.List(),
        fetching: false
      })
    }
  },
  START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  UPDATED: {
    next(state, action) {
      const index = state.get('allGroups').findIndex(group => {
        return group.get('id') === action.payload.id
      })
      let newGroup = Immutable.fromJS(action.payload)
      return state.merge({
        activeGroup: newGroup,
        allGroups: state.get('allGroups').set(index, newGroup),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  }
}, emptyGroups)

// ACTIONS

export const createGroup = createAction(CREATED, (brand, account) => {
  return axios.post(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteGroup = createAction(DELETED, (brand, account, id) => {
  return axios.delete(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${id}`, {
    headers: acceptJSON
  })
  .then(() => {
    return {id: id}
  });
})

export const fetchGroup = createAction(FETCHED, (brand, account, id) => {
  return axios.get(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${id}`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchGroups = createAction(FETCHED_ALL, (brand, account) => {
  return axios.get(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateGroup = createAction(UPDATED, (brand, account, group) => {
  return axios.put(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group.id}`, group, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const startFetching = createAction(START_FETCH)
