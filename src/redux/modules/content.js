import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {BASE_URL_AAA, mapReducers} from '../util'

const CONTENT_FETCHED = 'CONTENT_FETCHED'
const CONTENT_START_FETCH = 'CONTENT_START_FETCH'

export const emptyContent = Immutable.Map({
  accounts: Immutable.fromJS([
    {"account_id": 1, "name": "Disney"},
    {"account_id": 2, "name": "Some other company"}
  ]),
  fetching: false,
  groups: Immutable.fromJS([
    {"account_id": 1, "group_id": 1, "name": "Disney Interactive"},
    {"account_id": 1, "group_id": 2, "name": "Disney Cruises"},
    {"account_id": 1, "group_id": 3, "name": "Lucas Arts"},
    {"account_id": 2, "group_id": 1, "name": "Some company"}
  ]),
  properties: Immutable.fromJS([
    {
      "account_id": 1, "group_id": 1, "property": "www.test.com",
      "last_edited": 1451606200, "last_editor": "Jenny Steele",
      "status": "production", "active_version": "Version Name"
    },
    {
      "account_id": 1, "group_id": 1, "property": "www.dobar.com",
      "last_edited": 1451607200, "last_editor": "Jenny Steele",
      "status": "production", "active_version": "Name of Version"
    },
    {
      "account_id": 1, "group_id": 2, "property": "www.gobar.com",
      "last_edited": 1451608200, "last_editor": "Jenny Steele",
      "status": "in_process", "active_version": "The Version"
    },
    {
      "account_id": 2, "group_id": 1, "property": "www.aabar.com",
      "last_edited": 1451609200, "last_editor": "Jenny Steele",
      "status": "staging", "active_version": "Version 1"
    }
  ])
})

// REDUCERS

export function fetchSuccess(state, action) {
  return state.merge({
    accounts: Immutable.fromJS(action.payload.accounts),
    fetching: false,
    groups: Immutable.fromJS(action.payload.groups),
    properties: Immutable.fromJS(action.payload.properties)
  })
}

export function fetchFailed() {
  return emptyContent
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export default handleActions({
  CONTENT_FETCHED: mapReducers(fetchSuccess, fetchFailed),
  CONTENT_START_FETCH: startFetch
}, emptyContent)

// ACTIONS

export const fetchContent = createAction(CONTENT_FETCHED, (brand) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/content`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(CONTENT_START_FETCH)
