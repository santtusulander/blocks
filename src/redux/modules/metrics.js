import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import { Map, List, fromJS } from 'immutable'
import moment from 'moment-timezone'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'

const emptyTraffic = fromJS({
  now: [],
  history: []
})

const dailyTrafficOpts = {
  list_children: 'true',
  granularity: 'day'
}

const ACCOUNT_METRICS_START_FETCH = 'ACCOUNT_METRICS_START_FETCH'
const GROUP_METRICS_START_FETCH = 'GROUP_METRICS_START_FETCH'
const HOST_METRICS_START_FETCH = 'HOST_METRICS_START_FETCH'
const ACCOUNT_METRICS_FETCHED = 'ACCOUNT_METRICS_FETCHED'
const GROUP_METRICS_FETCHED = 'GROUP_METRICS_FETCHED'
const HOST_METRICS_FETCHED = 'HOST_METRICS_FETCHED'
const ACCOUNT_DAILY_TRAFFIC_FETCHED = 'ACCOUNT_DAILY_TRAFFIC_FETCHED'
const ACCOUNT_HOURLY_TRAFFIC_FETCHED = 'ACCOUNT_HOURLY_TRAFFIC_FETCHED'
const GROUP_DAILY_TRAFFIC_FETCHED = 'GROUP_DAILY_TRAFFIC_FETCHED'
//const GROUP_HOURLY_TRAFFIC_FETCHED = 'GROUP_HOURLY_TRAFFIC_FETCHED'
const HOST_DAILY_TRAFFIC_FETCHED = 'HOST_DAILY_TRAFFIC_FETCHED'
const HOST_HOURLY_TRAFFIC_FETCHED = 'HOST_HOURLY_TRAFFIC_FETCHED'

const emptyMetrics = Map({
  accountDailyTraffic: List(),
  accountMetrics: List(),
  accountHourlyTraffic: emptyTraffic,
  groupDailyTraffic: List(),
  groupMetrics: List(),
  groupHourlyTraffic: emptyTraffic,
  hostDailyTraffic: List(),
  hostMetrics: List(),
  hostHourlyTraffic: emptyTraffic,
  fetchingAccountMetrics: false,
  fetchingGroupMetrics: false,
  fetchingHostMetrics: false
})

export const parseDatapointTraffic = datapoint => {
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

export function fetchSuccess(fetchKey, dataKey, state, action) {
  const data = action.payload.data.map(datapoint => parseDatapointTraffic(datapoint))
  return state
  .set(fetchKey, false)
  .set(dataKey, fromJS(data))
}

export function fetchFailure(fetchKey, dataKey, state) {
  return state
    .set(fetchKey, false)
    .set(dataKey, List())
}

export function makeMetricsReducer(fetchKey, dataKey) {
  return {
    next: (state, action) => fetchSuccess(fetchKey, dataKey, state, action),
    throw: (state) => fetchFailure(fetchKey, dataKey, state)
  }
}

export const makeFetchStarter = fetchKey => state => state.set(fetchKey, true)

// TODO: Replace metrics endpoint with traffic endpoint after 0.7
// export function fetchHourlyAccountTrafficSuccess(state, action) {
//   return state.merge({
//     accountHourlyTraffic: fromJS({
//       now: action.payload.now.data,
//       history: action.payload.history.data
//     }),
//     fetching: false
//   })
// }
//
// export function fetchHourlyAccountTrafficFailure(state) {
//   return state.merge({
//     accountHourlyTraffic: emptyTraffic,
//     fetching: false
//   })
// }

export function fetchDailyAccountTrafficSuccess(state, action) {
  return state.merge({
    accountDailyTraffic: fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchDailyAccountTrafficFailure(state) {
  return state.merge({
    accountDailyTraffic: List(),
    fetching: false
  })
}

export function fetchDailyGroupTrafficSuccess(state, action) {
  return state.merge({
    groupDailyTraffic: fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchDailyGroupTrafficFailure(state) {
  return state.merge({
    groupDailyTraffic: List(),
    fetching: false
  })
}

export function fetchHourlyHostTrafficSuccess(state, action) {
  return state.merge({
    hostHourlyTraffic: fromJS({
      now: action.payload.now.data,
      history: action.payload.history.data
    }),
    fetching: false
  })
}

export function fetchHourlyHostTrafficFailure(state) {
  return state.merge({
    hostHourlyTraffic: emptyTraffic,
    fetching: false
  })
}

export function fetchDailyHostTrafficSuccess(state, action) {
  return state.merge({
    hostDailyTraffic: fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchDailyHostTrafficFailure(state) {
  return state.merge({
    hostDailyTraffic: List(),
    fetching: false
  })
}

// REDUCERS

export default handleActions({
  ACCOUNT_METRICS_FETCHED: makeMetricsReducer('fetchingAccountMetrics', 'accountMetrics'),
  ACCOUNT_DAILY_TRAFFIC_FETCHED: mapReducers(
    fetchDailyAccountTrafficSuccess,
    fetchDailyAccountTrafficFailure
  ),
  // ACCOUNT_HOURLY_TRAFFIC_FETCHED: mapReducers(
  //   fetchHourlyAccountTrafficSuccess,
  //   fetchHourlyAccountTrafficFailure
  // ),
  GROUP_METRICS_FETCHED: makeMetricsReducer('fetchingGroupMetrics', 'groupMetrics'),
  GROUP_DAILY_TRAFFIC_FETCHED: mapReducers(
    fetchDailyGroupTrafficSuccess,
    fetchDailyGroupTrafficFailure
  ),
  HOST_METRICS_FETCHED: makeMetricsReducer('fetchingHostMetrics', 'hostMetrics'),
  HOST_DAILY_TRAFFIC_FETCHED: mapReducers(
    fetchDailyHostTrafficSuccess,
    fetchDailyHostTrafficFailure
  ),
  HOST_HOURLY_TRAFFIC_FETCHED: mapReducers(
    fetchHourlyHostTrafficSuccess,
    fetchHourlyHostTrafficFailure
  ),
  ACCOUNT_METRICS_START_FETCH: makeFetchStarter('fetchingAccountMetrics'),
  GROUP_METRICS_START_FETCH: makeFetchStarter('fetchingGroupMetrics'),
  HOST_METRICS_START_FETCH: makeFetchStarter('fetchingHostMetrics')
}, emptyMetrics)

// ACTIONS

export const fetchHourlyAccountTraffic = createAction(ACCOUNT_HOURLY_TRAFFIC_FETCHED, opts => {
  const nowOpts = Object.assign({}, {
    list_children: 'true',
    granularity: 'hour'
  }, opts)
  const historyOpts = Object.assign({}, nowOpts, {
    startDate: moment(opts.startDate, 'X').subtract(28, 'days').format('X'),
    endDate: moment(opts.endDate, 'X').subtract(28, 'days').format('X')
  })
  return Promise.all([
    axios.get(`${analyticsBase()}/traffic${qsBuilder(nowOpts)}`),
    axios.get(`${analyticsBase()}/traffic${qsBuilder(historyOpts)}`)
  ]).then(response => {
    return {
      now: parseResponseData(response[0]),
      history: parseResponseData(response[1])
    }
  })
})

export const fetchDailyAccountTraffic = createAction(ACCOUNT_DAILY_TRAFFIC_FETCHED, opts => {
  const extendedOpts = Object.assign({resolution: 'hour'}, dailyTrafficOpts, opts)
  return axios.get(`${analyticsBase()}/traffic${qsBuilder(extendedOpts)}`)
  .then(parseResponseData)
})

export const fetchDailyGroupTraffic = createAction(GROUP_DAILY_TRAFFIC_FETCHED, opts => {
  const extendedOpts = Object.assign({resolution: 'hour'}, dailyTrafficOpts, opts)
  return axios.get(`${analyticsBase()}/traffic${qsBuilder(extendedOpts)}`)
  .then(parseResponseData)
})

export const fetchHourlyHostTraffic = createAction(HOST_HOURLY_TRAFFIC_FETCHED, opts => {
  const nowOpts = Object.assign({}, {
    granularity: 'hour'
  }, opts)

  let dateRange = moment.duration(opts.endDate - opts.startDate, 'seconds').add(1, 's').asDays()
  // use minimun of 28days
  if (dateRange < 28)  {
    dateRange = 28
  }

  const historyOpts = Object.assign({}, nowOpts, {
    startDate: moment(opts.startDate, 'X').subtract(dateRange, 'days').format('X'),
    endDate: moment(opts.endDate, 'X').subtract(dateRange, 'days').format('X')
  })
  return Promise.all([
    axios.get(`${analyticsBase()}/traffic${qsBuilder(nowOpts)}`),
    axios.get(`${analyticsBase()}/traffic${qsBuilder(historyOpts)}`)
  ]).then(response => {
    return {
      now: parseResponseData(response[0]),
      history: parseResponseData(response[1])
    }
  })
})

export const fetchDailyHostTraffic = createAction(HOST_DAILY_TRAFFIC_FETCHED, opts => {
  const extendedOpts = Object.assign({resolution: 'hour'}, dailyTrafficOpts, opts)
  return axios.get(`${analyticsBase()}/traffic${qsBuilder(extendedOpts)}`)
  .then(parseResponseData)
})

export const fetchAccountMetrics = createAction(ACCOUNT_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase()}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const fetchGroupMetrics = createAction(GROUP_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase()}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const fetchHostMetrics = createAction(HOST_METRICS_FETCHED, opts => {
  return axios.get(`${analyticsBase()}/metrics${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const startAccountFetching = createAction(ACCOUNT_METRICS_START_FETCH)

export const startGroupFetching = createAction(GROUP_METRICS_START_FETCH)

export const startHostFetching = createAction(HOST_METRICS_START_FETCH)

/**
 * getMetrics for a brand
 * @param  {Object} state [description]
 * @return {Map}       [description]
 */
export const getMetricsByBrand = (state /*, brand*/) => {
  return state.metrics.get('accountMetrics')
}

/**
 * getMetrics for an account
 * @param  {Object} state [description]
 * @return {Map}       [description]
 */
export const getMetricsByAccount = (state /*, account*/) => {
  return state.metrics.get('groupMetrics')
}
