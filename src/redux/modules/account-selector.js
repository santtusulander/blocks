import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'
import axios from 'axios'

const ACCOUNT_SELECTOR_START_FETCH = 'ACCOUNT_SELECTOR_START_FETCH'
const ACCOUNT_SELECTOR_FINISH_FETCH = 'ACCOUNT_SELECTOR_FINISH_FETCH'
const ACCOUNT_SELECTOR_ITEMS_FETCHED = 'ACCOUNT_SELECTOR_ITEMS_FETCHED'

import { urlBase, parseResponseData, mapReducers } from '../util'

const emptySelector = Immutable.Map({
  fetching: false,
  items: Immutable.List()
})

export function fetchItemsSuccess(state, action) {
  const data = action.payload.data || action.payload
  const items = data.map(
    item => item.id ? [item.id, item.name] : [item, item]
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

// REDUCERS

export default handleActions({
  ACCOUNT_SELECTOR_ITEMS_FETCHED: mapReducers(
    fetchItemsSuccess,
    fetchItemsFailure),
  ACCOUNT_SELECTOR_START_FETCH: startFetch,
  ACCOUNT_SELECTOR_FINISH_FETCH: finishFetch
}, emptySelector)

// ACTIONS

export const fetchItems = createAction(ACCOUNT_SELECTOR_ITEMS_FETCHED, (brand, account, group) => {
  let url = `${urlBase}/v2/brands/${brand}/accounts`
  if(group) {
    url = `${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`
  }
  else if(account) {
    url = `${urlBase}/v2/brands/${brand}/accounts/${account}/groups`
  }
  return axios.get(url).then(parseResponseData)
})

export const startFetching = createAction(ACCOUNT_SELECTOR_START_FETCH)
export const finishFetching = createAction(ACCOUNT_SELECTOR_FINISH_FETCH)
