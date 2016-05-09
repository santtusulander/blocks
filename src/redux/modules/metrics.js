import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import { analyticsBase, parseResponseData, qsBuilder } from '../util'

const ACCOUNT_METRICS_START_FETCH = 'ACCOUNT_METRICS_START_FETCH'
const GROUP_METRICS_START_FETCH = 'GROUP_METRICS_START_FETCH'
const HOST_METRICS_START_FETCH = 'HOST_METRICS_START_FETCH'
const ACCOUNT_METRICS_FETCHED = 'ACCOUNT_METRICS_FETCHED'
const GROUP_METRICS_FETCHED = 'GROUP_METRICS_FETCHED'
const HOST_METRICS_FETCHED = 'HOST_METRICS_FETCHED'

const emptyMetrics = Immutable.Map({
  accountMetrics: Immutable.List(),
  groupMetrics: Immutable.List(),
  hostMetrics: Immutable.List(),
  fetchingAccountMetrics: false,
  fetchingGroupMetrics: false,
  fetchingHostMetrics: false
})

const parseDatapointTraffic = datapoint => {
  datapoint.historical_traffic = datapoint.historical_traffic.map(traffic => {
    traffic.timestamp = moment(traffic.timestamp, 'X').toDate()
    return traffic;
  })
  datapoint.traffic = datapoint.traffic.map(traffic => {
    traffic.timestamp = moment(traffic.timestamp, 'X').toDate()
    return traffic;
  })
  datapoint.totalTraffic = datapoint.traffic.reduce((total, traffic) => {
    return total + traffic.bytes
  }, 0)
  return datapoint;
}

export const makeMetricsReducer = (fetchKey, dataKey) => {
  return {
    next: (state, action) => {
      const data = action.payload.data.map(datapoint => parseDatapointTraffic(datapoint))
      return state
        .set(fetchKey, false)
        .set(dataKey, Immutable.fromJS(data))
    },
    throw: state => state
      .set(fetchKey, false)
      .set(dataKey, Immutable.List())
  }
}

export const makeFetchStarter = fetchKey => state => state.set(fetchKey, true)

// REDUCERS

export default handleActions({
  ACCOUNT_METRICS_FETCHED: makeMetricsReducer('fetchingAccountMetrics', 'accountMetrics'),
  GROUP_METRICS_FETCHED: makeMetricsReducer('fetchingGroupMetrics', 'groupMetrics'),
  HOST_METRICS_FETCHED: makeMetricsReducer('fetchingHostMetrics', 'hostMetrics'),
  ACCOUNT_METRICS_START_FETCH: makeFetchStarter('fetchingAccountMetrics'),
  GROUP_METRICS_START_FETCH: makeFetchStarter('fetchingGroupMetrics'),
  HOST_METRICS_START_FETCH: makeFetchStarter('fetchingHostMetrics')
}, emptyMetrics)

// ACTIONS

export const fetchAccountMetrics = createAction(ACCOUNT_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const fetchGroupMetrics = createAction(GROUP_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const fetchHostMetrics = createAction(HOST_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const startAccountFetching = createAction(ACCOUNT_METRICS_START_FETCH)

export const startGroupFetching = createAction(GROUP_METRICS_START_FETCH)

export const startHostFetching = createAction(HOST_METRICS_START_FETCH)
