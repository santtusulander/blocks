import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'
import axios from 'axios'

const ACCOUNT_SELECTOR_START_FETCH = 'ACCOUNT_SELECTOR_START_FETCH'
const ACCOUNT_SELECTOR_FINISH_FETCH = 'ACCOUNT_SELECTOR_FINISH_FETCH'
const ACCOUNT_SELECTOR_ITEMS_FETCHED = 'ACCOUNT_SELECTOR_ITEMS_FETCHED'
const ACCOUNT_SELECTOR_OPEN_SET = 'ACCOUNT_SELECTOR_OPEN_SET'
const ACCOUNT_SELECTOR_SEARCH_SET = 'ACCOUNT_SELECTOR_SEARCH_SET'

import { BASE_URL_AAA, BASE_URL_NORTH, PAGINATION_MOCK, parseResponseData, mapReducers } from '../util'

const emptySelector = Immutable.Map({
  fetching: false,
  items: Immutable.List(),
  open: false,
  searchValue: ''
})

export function fetchItemsSuccess(state, action) {
  const data = action.payload.data || action.payload
  const items = data.map(
    (item) => {
      return item.id ?
      //check if account
      (item.provider_type ? [item.id, item.name, item.provider_type] : [item.id, item.name]) :
      //check if item is property => use published_host_id as name & value
      item.published_host_id ? [item.published_host_id, item.published_host_id] : [item, item]
    }
  )
  return state.merge({
    items: Immutable.fromJS(items)
  })
}

export function fetchItemsFailure(state) {
  return state.merge({
    items: Immutable.List()
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function finishFetch(state) {
  return state.set('fetching', false)
}

export function openSet(state, action) {
  return state.set('open', action.payload)
}

export function searchSet(state, action) {
  return state.set('searchValue', action.payload)
}

// REDUCERS

export default handleActions({
  ACCOUNT_SELECTOR_ITEMS_FETCHED: mapReducers(
    fetchItemsSuccess,
    fetchItemsFailure),
  ACCOUNT_SELECTOR_START_FETCH: startFetch,
  ACCOUNT_SELECTOR_FINISH_FETCH: finishFetch,
  ACCOUNT_SELECTOR_OPEN_SET: openSet,
  ACCOUNT_SELECTOR_SEARCH_SET: searchSet
}, emptySelector)

// ACTIONS

export const fetchItems = createAction(ACCOUNT_SELECTOR_ITEMS_FETCHED, (brand, account, group) => {
  let url = `${BASE_URL_AAA}/brands/${brand}/accounts`
  if (group) {
    url = `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`
  }  else if (account) {
    url = `${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`
  }
  return axios.get(url, PAGINATION_MOCK).then(parseResponseData)
})

export const startFetching = createAction(ACCOUNT_SELECTOR_START_FETCH)
export const finishFetching = createAction(ACCOUNT_SELECTOR_FINISH_FETCH)
export const setOpen = createAction(ACCOUNT_SELECTOR_OPEN_SET)
export const setSearch = createAction(ACCOUNT_SELECTOR_SEARCH_SET)
