import {createAction, handleActions} from 'redux-actions'
import {Map} from 'immutable'
import {mapReducers} from '../../util'

import * as api from './api'
import {receive, fail} from './reducers'

import {FETCH,FETCH_ALL, FETCH_ALL_WITH_DETAILS} from './actionTypes'

const initialState = new Map()

/*actions creators*/
export const fetch = createAction(FETCH, (brand, account, group, id) => {
  return api.fetch( brand, account, group, id)
})

export const fetchAll = createAction(FETCH_ALL, (brand, account, group) => {
  return api.fetchAll( brand, account, group)
})

export const fetchAllWithDetails = createAction(FETCH_ALL_WITH_DETAILS, (brand, account, group) => {
  return api.fetchAllWithDetails( brand, account, group)
})

export const startFetching = createAction('properties/START_FETCHING')

export default handleActions({
  [FETCH]:  mapReducers(receive, fail),
  [FETCH_ALL]:  mapReducers(receive, fail),
  [FETCH_ALL_WITH_DETAILS]:  mapReducers(receive, fail)
}, initialState)
