import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
// import moment from 'moment'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'

const DASHBOARD_START_FETCH = 'DASHBOARD_START_FETCH'
const DASHBOARD_FINISH_FETCH = 'DASHBOARD_FINISH_FETCH'
const DASHBOARD_FETCHED = 'DASHBOARD_FETCHED'

const emptyDashboard = Immutable.Map({
  fetching: false
})

// REDUCERS
export function dashboardFetchSuccess(state, action) {
  console.log(state, action)
}

export function dashboardFetchFailure(state) {
  console.log(state)
}

export function dashboardStartFetch(state){
  return state.set('fetching', true)
}

export function dashboardFinishFetch(state){
  return state.set('fetching', false)
}

export default handleActions({
  DASHBOARD_FETCHED: mapReducers(dashboardFetchSuccess, dashboardFetchFailure),
  DASHBOARD_START_FETCH: dashboardStartFetch,
  DASHBOARD_FINISH_FETCH: dashboardFinishFetch
}, emptyDashboard)

// ACTIONS
export const fetchDashboard = createAction(DASHBOARD_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/sp-dashboard${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const startFetching = createAction(DASHBOARD_START_FETCH)

export const finishFetching = createAction(DASHBOARD_FINISH_FETCH)
