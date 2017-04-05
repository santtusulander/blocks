import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import { BASE_URL_AAA, PAGINATION_MOCK, mapReducers, parseResponseData } from '../util'

const ACCOUNT_CREATED = 'ACCOUNT_CREATED'
const ACCOUNT_DELETED = 'ACCOUNT_DELETED'
const ACCOUNT_FETCHED = 'ACCOUNT_FETCHED'
const ACCOUNT_FETCHED_ALL = 'ACCOUNT_FETCHED_ALL'
const ACCOUNT_START_FETCH = 'ACCOUNT_START_FETCH'
const ACCOUNT_UPDATED = 'ACCOUNT_UPDATED'
const ACCOUNT_CHANGE_ACTIVE = 'ACCOUNT_CHANGE_ACTIVE'
const ACCOUNT_CLEAR_ACTIVE = 'ACCOUNT_CLEAR_ACTIVE'
const ACCOUNT_RESET_CHANGED = 'ACCOUNT_RESET_CHANGED'

const emptyAccounts = Immutable.fromJS({
  changedAccount: null,
  activeAccount: undefined,
  allAccounts: [],
  fetching: false
})

export function createSuccess(state, action) {
  const newAccount = Immutable.fromJS(action.payload)
  return state.merge({
    activeAccount: newAccount,
    allAccounts: state.get('allAccounts').push(newAccount),
    changedAccount: { id: action.payload.id, name: action.payload.name, action: 'add' }
  })
}

export function deleteSuccess(state, action) {
  // eslint-disable-next-line eqeqeq
  const newAllAccounts = state.get('allAccounts').filterNot(account => account.get('id') == action.payload.id)
  return state.merge({
    allAccounts: newAllAccounts,
    fetching: false,
    changedAccount: { id: action.payload.id, action: 'delete' }
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

export function changedAccountReset(state) {
  return state.set('changedAccount', null)
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

export function updateSuccess(state, action) {
  const updatedAccount = Immutable.fromJS(action.payload)
  const currIndex = state.get('allAccounts').findIndex(
    account => account.get('id') === updatedAccount.get('id')
  )
  const updatedAccounts = currIndex !== -1 ?
    state.get('allAccounts').set(currIndex, updatedAccount)
    : state.get('allAccounts')
  return state.merge({
    changedAccount: { id: action.payload.id, name: action.payload.name, action: 'edit' },
    activeAccount: updatedAccount,
    allAccounts: updatedAccounts,
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

export function clearActive(state) {
  return state.delete('activeAccount')
}

// REDUCERS

export default handleActions({
  ACCOUNT_CREATED: createSuccess,
  ACCOUNT_DELETED: mapReducers(deleteSuccess, deleteFailure),
  ACCOUNT_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  ACCOUNT_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  ACCOUNT_START_FETCH: startFetch,
  ACCOUNT_UPDATED: mapReducers(updateSuccess, updateFailure),
  ACCOUNT_CHANGE_ACTIVE: changeActive,
  ACCOUNT_CLEAR_ACTIVE: clearActive,
  ACCOUNT_RESET_CHANGED: changedAccountReset
}, emptyAccounts)

// ACTIONS

export const createAccount = createAction(ACCOUNT_CREATED, (brand, account) => {
  return axios.post(`${BASE_URL_AAA}/brands/${brand}/accounts`, account, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponseData)
})

export const deleteAccount = createAction(ACCOUNT_DELETED, (brand, id) => {
  return axios.delete(`${BASE_URL_AAA}/brands/${brand}/accounts/${id}`)
  .then(() => {
    return {id: id}
  });
})

export const fetchAccount = createAction(ACCOUNT_FETCHED, (brand, id) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${id}`)
  .then(parseResponseData);
})

export const fetchAccounts = createAction(ACCOUNT_FETCHED_ALL, (brand) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts`, PAGINATION_MOCK)
  .then(parseResponseData);
})

export const updateAccount = createAction(ACCOUNT_UPDATED, (brand, id, account) => {
  return axios.put(`${BASE_URL_AAA}/brands/${brand}/accounts/${id}`, account, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponseData)
})

export const resetChangedAccount = createAction(ACCOUNT_RESET_CHANGED)
export const clearActiveAccount = createAction(ACCOUNT_CLEAR_ACTIVE)
export const startFetching = createAction(ACCOUNT_START_FETCH)
export const changeActiveAccount = createAction(ACCOUNT_CHANGE_ACTIVE)


//selectors

/**
 * getById get account by Id
 * @param  {[type]} state [description]
 * @param  {Number} id id to be found
 * @return {Map}       Map of found account
 */
export const getById = (state /*, id*/) => {
  /*
  NOTE: this doesn't make much sense at the moment as activeAccount always contains single item but this is for future compatibility
  */
  return state.account.get('activeAccount') //In future: && state.account.get('activeAccount').find( item => item && item.get('id') === parseInt(id))
}

export const isFetching = (state) => {
  return state.account.get('fetching')
}
