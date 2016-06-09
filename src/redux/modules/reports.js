import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'
import axios from 'axios'

const REPORTS_START_FETCH = 'REPORTS_START_FETCH'
const REPORTS_FINISH_FETCH = 'REPORTS_FINISH_FETCH'
const REPORTS_URL_METRICS_FETCHED = 'REPORTS_URL_METRICS_FETCHED'
const REPORTS_FILE_ERROR_METRICS_FETCHED = 'REPORTS_FILE_ERROR_METRICS_FETCHED'
const REPORTS_STATUS_CODE_TOGGLED = 'REPORTS_STATUS_CODE_TOGGLED'


import STATUS_CODES from '../../constants/status-codes.js'
import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'

const emptyReports = Immutable.Map({
  errorStatusCodes: Immutable.fromJS(STATUS_CODES),
  fetching: false,
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
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

export function fetchFileErrorMetricsSuccess(state, action) {

  const activeStatusCodes = state.get('errorStatusCodes');
  console.log(action.payload.data.num_errors)
  const filteredFileErrorSummary = Immutable.fromJS(action.payload.data.num_errors)
    .entrySeq().reduce(
      (totals, summary) => {
        console.log(totals, summary)
        const code = parseInt(summary[0].substring(1))
        if(activeStatusCodes.includes(code)) {
          totals[code < 500 ? 'clientErrs' : 'serverErrs'].push({
            code: code,
            value: summary[1]
          })
          return totals
        }
      }, {serverErrs: [], clientErrs: []})


    const {serverErrs, clientErrs} = this.props.summary.entrySeq().reduce(
      (totals, summary) => {
        const code = parseInt(summary[0].substring(1))
        totals[code < 500 ? 'clientErrs' : 'serverErrs'].push({
          code: code,
          value: summary[1]
        })
        return totals
      }, {serverErrs: [], clientErrs: []}
    )

  let filteredFileErrorUrls = Immutable.List()
  state.get('errorStatusCodes').forEach(code => {
    filteredFileErrorUrls = filteredFileErrorUrls.concat(
      Immutable.fromJS(action.payload.data.url_details)
        .filter(url => url.get('status_code') === code.toString())
    )
  })
  return state.merge({
    fileErrorSummary: filteredFileErrorSummary || Immutable.Map(),
    fileErrorURLs: Immutable.fromJS(filteredFileErrorUrls)
  })
}

export function fetchFileErrorMetricsFailure(state) {
  return state.merge({
    fileErrorSummary: Immutable.Map(),
    fileErrorURLs: Immutable.List()
  })
}

export function startFetch(state) {
  return state.set('fetching', true)
}

export function finishFetch(state) {
  return state.set('fetching', false)
}

export function statusCodeToggled(state, action) {
  let newStatusCodes = state.get('errorStatusCodes')
  if(newStatusCodes.includes(action.payload)) {
    newStatusCodes = newStatusCodes.filter(code => code !== action.payload)
  }
  else {
    newStatusCodes = newStatusCodes.push(action.payload)
  }
  return state.set('errorStatusCodes', newStatusCodes)
}

// REDUCERS

export default handleActions({
  REPORTS_URL_METRICS_FETCHED: mapReducers(
    fetchUrlMetricsSuccess,
    fetchUrlMetricsFailure),
  REPORTS_FILE_ERROR_METRICS_FETCHED: mapReducers(
    fetchFileErrorMetricsSuccess,
    fetchFileErrorMetricsFailure
  ),
  REPORTS_START_FETCH: startFetch,
  REPORTS_FINISH_FETCH: finishFetch,
  REPORTS_STATUS_CODE_TOGGLED: statusCodeToggled
}, emptyReports)

// ACTIONS

export const fetchURLMetrics = createAction(REPORTS_URL_METRICS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/urls${qsBuilder(opts)}`)
    .then(parseResponseData);
})

export const fetchFileErrorsMetrics = createAction(REPORTS_FILE_ERROR_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase()}/file-errors${qsBuilder(opts)}`)
    .then(parseResponseData);
})

export const startFetching = createAction(REPORTS_START_FETCH)
export const finishFetching = createAction(REPORTS_FINISH_FETCH)
export const toggleStatusCode = createAction(REPORTS_STATUS_CODE_TOGGLED)
