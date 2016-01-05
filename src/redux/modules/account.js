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

const emptyAccounts = Immutable.Map({
  activeAccount: null,
  allAccounts: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  CREATED: {
    next(state, action) {
      const newAccount = Immutable.fromJS(action.payload)
      return state.merge({
        activeAccount: newAccount,
        allAccounts: state.get('allAccounts').push(newAccount)
      })
    }
  },
  DELETED: {
    next(state, action) {
      let newAllAccounts = state.get('allAccounts')
        .filterNot(account => {
          return account.get('id') === action.payload.id
        })
      return state.merge({
        allAccounts: newAllAccounts,
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
        activeAccount: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activeAccount: null,
        fetching: false
      })
    }
  },
  FETCHED_ALL: {
    next(state, action) {
      return state.merge({
        allAccounts: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        allAccounts: Immutable.List(),
        fetching: false
      })
    }
  },
  START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  UPDATED: {
    next(state, action) {
      const index = state.get('allAccounts').findIndex(account => {
        return account.get('id') === action.payload.id
      })
      let newAccount = Immutable.fromJS(action.payload)
      return state.merge({
        activeAccount: newAccount,
        allAccounts: state.get('allAccounts').set(index, newAccount),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  }
}, emptyAccounts)

// ACTIONS

export const createAccount = createAction(CREATED, (brand) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteAccount = createAction(DELETED, (brand, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`, {
    headers: defaultHeaders
  })
  .then(() => {
    return {id: id}
  });
})

export const fetchAccount = createAction(FETCHED, (brand, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchAccounts = createAction(FETCHED_ALL, (brand) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateAccount = createAction(UPDATED, (brand, account) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account.id}`, account, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const startFetching = createAction(START_FETCH)
