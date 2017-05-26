import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'
import axios from 'axios'

const REPORTS_START_FETCH = 'REPORTS_START_FETCH'
const REPORTS_FINISH_FETCH = 'REPORTS_FINISH_FETCH'
const REPORTS_URL_METRICS_FETCHED = 'REPORTS_URL_METRICS_FETCHED'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'

const emptyReports = Immutable.Map({
  fetching: false,
  urlMetrics: Immutable.List()
})

export function fetchUrlMetricsSuccess(state, action) {
  return state.merge({
    urlMetrics: Immutable.fromJS(action.payload.data)
  })
}

export function fetchUrlMetricsFailure(state) {
  return state.merge({
    urlMetrics: Immutable.List()
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
  REPORTS_URL_METRICS_FETCHED: mapReducers(
    fetchUrlMetricsSuccess,
    fetchUrlMetricsFailure),
  REPORTS_START_FETCH: startFetch,
  REPORTS_FINISH_FETCH: finishFetch
}, emptyReports)

// ACTIONS

export const fetchURLMetrics = createAction(REPORTS_URL_METRICS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/urls${qsBuilder(opts)}`)
    .then(parseResponseData);
})

export const startFetching = createAction(REPORTS_START_FETCH)
export const finishFetching = createAction(REPORTS_FINISH_FETCH)
