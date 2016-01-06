import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {defaultHeaders, urlBase} from '../util'

const ACCOUNT_CREATED = 'ACCOUNT_CREATED'
const ACCOUNT_DELETED = 'ACCOUNT_DELETED'
const ACCOUNT_FETCHED = 'ACCOUNT_FETCHED'
const ACCOUNT_FETCHED_ALL = 'ACCOUNT_FETCHED_ALL'
const ACCOUNT_START_FETCH = 'ACCOUNT_START_FETCH'
const ACCOUNT_UPDATED = 'ACCOUNT_UPDATED'
const ACTIVE_ACCOUNT_CHANGED = 'ACTIVE_ACCOUNT_CHANGED'

const emptyAccounts = Immutable.Map({
  activeAccount: null,
  allAccounts: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  ACCOUNT_CREATED: {
    next(state, action) {
      const newAccount = Immutable.fromJS(action.payload)
      return state.merge({
        activeAccount: newAccount,
        allAccounts: state.get('allAccounts').push(newAccount)
      })
    }
  },
  ACCOUNT_DELETED: {
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
  ACCOUNT_FETCHED: {
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
  ACCOUNT_FETCHED_ALL: {
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
  ACCOUNT_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  ACCOUNT_UPDATED: {
    next(state) {
      return state.merge({
        activeAccount: null,
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  ACTIVE_ACCOUNT_CHANGED: (state, action) => {
    return state.set('activeAccount', action.payload)
  }
}, emptyAccounts)

// ACTIONS

export const createAccount = createAction(ACCOUNT_CREATED, (brand) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/`, {}, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteAccount = createAction(ACCOUNT_DELETED, (brand, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`, {
    headers: defaultHeaders
  })
  .then(() => {
    return {activeAccount: null}
  });
})

export const fetchAccount = createAction(ACCOUNT_FETCHED, (brand, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchAccounts = createAction(ACCOUNT_FETCHED_ALL, (brand) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/`, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateAccount = createAction(ACCOUNT_UPDATED, (brand, account) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account.account_id}`, account, {
    headers: defaultHeaders
  })
  .then((res) => {
    if(res) {
      return account;
    }
  })
})

export const startFetching = createAction(ACCOUNT_START_FETCH)

export const changeActiveAccount = createAction(ACTIVE_ACCOUNT_CHANGED)
