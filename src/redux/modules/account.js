import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import { Promise } from 'bluebird';

import { urlBase, mapReducers, parseResponseData } from '../util'

const ACCOUNT_CREATED = 'ACCOUNT_CREATED'
const ACCOUNT_DELETED = 'ACCOUNT_DELETED'
const ACCOUNT_FETCHED = 'ACCOUNT_FETCHED'
const ACCOUNT_FETCHED_ALL = 'ACCOUNT_FETCHED_ALL'
const ACCOUNT_START_FETCH = 'ACCOUNT_START_FETCH'
const ACCOUNT_UPDATED = 'ACCOUNT_UPDATED'
const ACTIVE_ACCOUNT_CHANGED = 'ACTIVE_ACCOUNT_CHANGED'

const emptyAccounts = Immutable.fromJS({
  activeAccount: null,
  allAccounts: [],
  fetching: false
})

export function createSuccess(state, action) {
  const newAccount = Immutable.fromJS(action.payload)
  return state.merge({
    activeAccount: newAccount,
    allAccounts: state.get('allAccounts').push(newAccount.get('account_id'))
  })
}

export function deleteSuccess(state, action) {
  const newAllAccounts = state.get('allAccounts').filterNot(account => account === action.payload.id)
  return state.merge({
    allAccounts: newAllAccounts,
    fetching: false
  })
}

export function deleteFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function fetchSuccess(state, action) {
  return state.merge({
    activeAccount: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchFailure(state) {
  return state.merge({
    activeAccount: null,
    fetching: false
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allAccounts: Immutable.fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allAccounts: Immutable.List(),
    fetching: false
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function updateSuccess(state) {
  return state.merge({
    activeAccount: null,
    fetching: false
  })
}

export function updateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function changeActive(state, action) {
  return state.set('activeAccount', action.payload)
}

// REDUCERS

export default handleActions({
  ACCOUNT_CREATED: createSuccess,
  ACCOUNT_DELETED: mapReducers(deleteSuccess, deleteFailure),
  ACCOUNT_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  ACCOUNT_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  ACCOUNT_START_FETCH: startFetch,
  ACCOUNT_UPDATED: mapReducers(updateSuccess, updateFailure),
  ACTIVE_ACCOUNT_CHANGED: changeActive
}, emptyAccounts)

// ACTIONS

export const createAccount = createAction(ACCOUNT_CREATED, (brand) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponseData)
})

export const deleteAccount = createAction(ACCOUNT_DELETED, (brand, id) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchAccount = createAction(ACCOUNT_FETCHED, (brand, id) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${id}`)
  .then(parseResponseData);

  return Promise.resolve( accountData )
})

export const fetchAccounts = createAction(ACCOUNT_FETCHED_ALL, (brand) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts`)
  .then(parseResponseData);
})

export const updateAccount = createAction(ACCOUNT_UPDATED, (brand, account) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account.account_id}`, account, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if(res) {
      return account;
    }
  })
})

export const startFetching = createAction(ACCOUNT_START_FETCH)

export const changeActiveAccount = createAction(ACTIVE_ACCOUNT_CHANGED)
