import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import { analyticsBase, qsBuilder, parseResponseData, mapReducers } from '../util'

const TRAFFIC_START_FETCH = 'TRAFFIC_START_FETCH'
const TRAFFIC_FINISH_FETCH = 'TRAFFIC_FINISH_FETCH'
const TRAFFIC_FETCHED = 'TRAFFIC_FETCHED'
const TOTALS_FETCHED = 'TOTALS_FETCHED'
const TRAFFIC_BY_TIME_FETCHED = 'TRAFFIC_BY_TIME_FETCHED'
const TRAFFIC_BY_TIME_COMPARISON_FETCHED = 'TRAFFIC_BY_TIME_COMPARISON_FETCHED'
const TRAFFIC_BY_COUNTRY_FETCHED = 'TRAFFIC_BY_COUNTRY_FETCHED'
const TRAFFIC_TOTAL_EGRESS_FETCHED = 'TRAFFIC_TOTAL_EGRESS_FETCHED'
const TRAFFIC_ON_OFF_NET_FETCHED = 'TRAFFIC_ON_OFF_NET_FETCHED'
const TRAFFIC_ON_OFF_NET_TODAY_FETCHED = 'TRAFFIC_ON_OFF_NET_TODAY_FETCHED'
const TRAFFIC_SERVICE_PROVIDERS_FETCHED = 'TRAFFIC_SERVICE_PROVIDERS_FETCHED'
const TRAFFIC_STORAGE_FETCHED = 'TRAFFIC_STORAGE_FETCHED'

const emptyTraffic = Immutable.Map({
  traffic: Immutable.List(),
  totals: Immutable.Map(),
  byTime: Immutable.List(),
  byCountry: Immutable.List(),
  fetching: false,
  onOffNet: Immutable.fromJS({
    detail: [{
      net_on: { percent_total: 0, bytes: 0  },
      net_off: { percent_total: 0, bytes: 0 },
      timestamp: new Date().getTime(),
      total: 0
    }],
    net_on: {bytes: 0, percent_total: 0},
    net_off: {bytes: 0, percent_total: 0},
    total: 0

  }),
  onOffNetToday: Immutable.fromJS({
    detail: [{
      net_on: { percent_total: 0, bytes: 0, timestamp: new Date().getTime()}, total: 0,
      net_off: { percent_total: 0, bytes: 0, timestamp: new Date().getTime(), total: 0}
    }],
    net_on: {bytes: 0, percent_total: 0},
    net_off: {bytes: 0, percent_total: 0},
    total: 0
  }),
  serviceProviders: Immutable.List(),
  storage: Immutable.List(),
  totalEgress: 0
})

// REDUCERS
export function trafficFetchSuccess(state, action){
  return state.merge({
    traffic: Immutable.fromJS(action.payload.data.map(entity => {
      entity.detail = entity.detail.map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
        return datapoint
      })
      return entity
    }))
  })
}

export function trafficFetchFailure(state){
  return state.merge({
    traffic: Immutable.List()
  })
}

export function totalsFetchSuccess(state, action){
  // API always returns an array, therefore we access the first child, [0]
  const data = Immutable.fromJS(action.payload.data)
  return state.merge({
    totals: data.getIn([0, 'totals']) || Immutable.Map()
  })
}

export function totalsFetchFailure(state){
  return state.merge({
    totals: Immutable.Map()
  })
}

export function trafficByTimeSuccess(state, action){
  return state.merge({
    byTime: Immutable.fromJS(action.payload.data.map(datapoint => {
      datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
      return datapoint
    }))
  })
}

export function trafficByTimeFailure(state){
  return state.merge({
    byTime: Immutable.List()
  })
}

export function trafficByTimeComparisonSuccess(state, action){
  return state.merge({
    byTimeComparison: Immutable.fromJS(action.payload.data.map(datapoint => {
      datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
      return datapoint
    }))
  })
}

export function trafficByTimeComparisonFailure(state){
  return state.merge({
    byTimeComparison: Immutable.List()
  })
}

export function trafficByCountrySuccess(state, action){
  return state.merge({
    byCountry: Immutable.fromJS(action.payload.data.countries)
  })
}
export function trafficByCountryFailure(state){
  return state.merge({
    byCountry: Immutable.List()
  })
}

export function trafficTotalEgressSuccess(state, action){
  return state.merge({
    totalEgress: Immutable.fromJS(action.payload.data.bytes)
  })
}

export function trafficTotalEgressFailure(state){
  return state.merge({
    totalEgress: 0
  })
}

export function trafficOnOffNetSuccess(state, action){
  action.payload.data.detail = action.payload.data.detail.map(datapoint => {
    datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
    return datapoint
  })
  return state.merge({
    onOffNet: Immutable.fromJS(action.payload.data)
  })
}

export function trafficOnOffNetFailure(state){
  return state.merge({
    onOffNet: Immutable.Map()
  })
}

export function trafficOnOffNetTodaySuccess(state, action){
  return state.merge({
    onOffNetToday: Immutable.fromJS(action.payload.data)
  })
}
export function trafficOnOffNetTodayFailure(state){
  return state.merge({
    onOffNetToday: Immutable.Map()
  })
}

export function trafficServiceProvidersSuccess(state, action){
  return state.merge({
    serviceProviders: Immutable.fromJS(action.payload.data)
  })
}
export function trafficServiceProvidersFailure(state){
  return state.merge({
    serviceProviders: Immutable.Map()
  })
}

export function trafficStorageSuccess(state, action){
  action.payload.data = action.payload.data.map(datapoint => {
    datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
    return datapoint
  })
  return state.merge({
    storage: Immutable.fromJS(action.payload.data)
  })
}

export function trafficStorageFailure(state){
  return state.merge({
    storage: Immutable.Map()
  })
}

export function trafficStartFetch(state){
  return state.set('fetching', true)
}

export function trafficFinishFetch(state){
  return state.set('fetching', false)
}

export default handleActions({
  TRAFFIC_FETCHED: mapReducers(trafficFetchSuccess, trafficFetchFailure),
  TOTALS_FETCHED: mapReducers(totalsFetchSuccess, totalsFetchFailure),
  TRAFFIC_BY_TIME_FETCHED: mapReducers(trafficByTimeSuccess, trafficByTimeFailure),
  TRAFFIC_BY_TIME_COMPARISON_FETCHED: mapReducers(trafficByTimeComparisonSuccess, trafficByTimeComparisonFailure),
  TRAFFIC_BY_COUNTRY_FETCHED: mapReducers(trafficByCountrySuccess, trafficByCountryFailure),
  TRAFFIC_TOTAL_EGRESS_FETCHED: mapReducers(trafficTotalEgressSuccess, trafficTotalEgressFailure),
  TRAFFIC_ON_OFF_NET_FETCHED: mapReducers(trafficOnOffNetSuccess, trafficOnOffNetFailure),
  TRAFFIC_ON_OFF_NET_TODAY_FETCHED: mapReducers(trafficOnOffNetTodaySuccess, trafficOnOffNetTodayFailure),
  TRAFFIC_SERVICE_PROVIDERS_FETCHED: mapReducers(trafficServiceProvidersSuccess, trafficServiceProvidersFailure),
  TRAFFIC_STORAGE_FETCHED: mapReducers(trafficStorageSuccess, trafficStorageFailure),
  TRAFFIC_START_FETCH: trafficStartFetch,
  TRAFFIC_FINISH_FETCH: trafficFinishFetch
}, emptyTraffic)

// ACTIONS
export const fetchTraffic = createAction(TRAFFIC_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchTotals = createAction(TOTALS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}&show_detail=false`)
  .then(parseResponseData);
})

export const fetchByTime = createAction(TRAFFIC_BY_TIME_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/time${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchByTimeComparison = createAction(TRAFFIC_BY_TIME_COMPARISON_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/time${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchByCountry = createAction(TRAFFIC_BY_COUNTRY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchTotalEgress = createAction(TRAFFIC_TOTAL_EGRESS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/total${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchOnOffNet = createAction(TRAFFIC_ON_OFF_NET_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/on-off-net${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchOnOffNetToday = createAction(TRAFFIC_ON_OFF_NET_TODAY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/on-off-net${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchServiceProviders = createAction(TRAFFIC_SERVICE_PROVIDERS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/service-provider${qsBuilder(opts)}`)
  .then(parseResponseData)
})

export const fetchStorage = createAction(TRAFFIC_STORAGE_FETCHED, () => {
  return Promise.resolve({data: [
    {
      timestamp: 1459468800,
      bytes: 6531816426588
    },
    {
      timestamp: 1459555200,
      bytes: 3531816426500
    },
    {
      timestamp: 1459641600,
      bytes: 9367492184905
    }
  ]})
})

export const startFetching = createAction(TRAFFIC_START_FETCH)

export const finishFetching = createAction(TRAFFIC_FINISH_FETCH)
