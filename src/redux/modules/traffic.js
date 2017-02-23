import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import { BASE_URL_AAA, analyticsBase, qsBuilder, parseResponseData, mapReducers } from '../util'

const TRAFFIC_START_FETCH = 'TRAFFIC_START_FETCH'
const TRAFFIC_FINISH_FETCH = 'TRAFFIC_FINISH_FETCH'
const TRAFFIC_FETCHED = 'TRAFFIC_FETCHED'
const TOTALS_FETCHED = 'TOTALS_FETCHED'
const TRAFFIC_BY_TIME_FETCHED = 'TRAFFIC_BY_TIME_FETCHED'
const TRAFFIC_BY_TIME_COMPARISON_FETCHED = 'TRAFFIC_BY_TIME_COMPARISON_FETCHED'
const TRAFFIC_BY_COUNTRY_FETCHED = 'TRAFFIC_BY_COUNTRY_FETCHED'
const TRAFFIC_BY_CITY_FETCHED = 'TRAFFIC_BY_CITY_FETCHED'
const TRAFFIC_TOTAL_EGRESS_FETCHED = 'TRAFFIC_TOTAL_EGRESS_FETCHED'
const TRAFFIC_ON_OFF_NET_FETCHED = 'TRAFFIC_ON_OFF_NET_FETCHED'
const TRAFFIC_ON_OFF_NET_TODAY_FETCHED = 'TRAFFIC_ON_OFF_NET_TODAY_FETCHED'
const TRAFFIC_SERVICE_PROVIDERS_FETCHED = 'TRAFFIC_SERVICE_PROVIDERS_FETCHED'
const TRAFFIC_CONTENT_PROVIDERS_FETCHED = 'TRAFFIC_CONTENT_PROVIDERS_FETCHED'
const TRAFFIC_STORAGE_FETCHED = 'TRAFFIC_STORAGE_FETCHED'

const emptyTraffic = Immutable.Map({
  traffic: Immutable.List(),
  totals: Immutable.Map(),
  byTime: Immutable.Map(),
  byTimeComparison: Immutable.Map(),
  byCountry: Immutable.List(),
  byCity: Immutable.List(),
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
  contribution: Immutable.Map(),
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
    byTime: {
      totals: Immutable.fromJS(action.payload.data.totals),
      details: Immutable.fromJS(action.payload.data.details.map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
        return datapoint
      }))
    }
  })
}

export function trafficByTimeFailure(state){
  return state.merge({
    byTime: Immutable.Map()
  })
}

export function trafficByTimeComparisonSuccess(state, action){
  return state.merge({
    byTimeComparison: {
      totals: Immutable.fromJS(action.payload.data.totals),
      details: Immutable.fromJS(action.payload.data.details.map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
        return datapoint
      }))
    }
  })
}

export function trafficByTimeComparisonFailure(state){
  return state.merge({
    byTimeComparison: Immutable.Map()
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

export function trafficByCitySuccess(state, action){
  return state.merge({
    byCity: Immutable.fromJS(action.payload.data.cities)
  })
}
export function trafficByCityFailure(state){
  return state.merge({
    byCity: Immutable.List()
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
    contribution: Immutable.fromJS(action.payload)
  })
}
export function trafficServiceProvidersFailure(state){
  return state.merge({
    contribution: Immutable.Map()
  })
}

export function trafficContentProvidersSuccess(state, action){
  return state.merge({
    contribution: Immutable.fromJS(action.payload)
  })
}
export function trafficContentProvidersFailure(state){
  return state.merge({
    contribution: Immutable.Map()
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
  TRAFFIC_BY_CITY_FETCHED: mapReducers(trafficByCitySuccess, trafficByCityFailure),
  TRAFFIC_TOTAL_EGRESS_FETCHED: mapReducers(trafficTotalEgressSuccess, trafficTotalEgressFailure),
  TRAFFIC_ON_OFF_NET_FETCHED: mapReducers(trafficOnOffNetSuccess, trafficOnOffNetFailure),
  TRAFFIC_ON_OFF_NET_TODAY_FETCHED: mapReducers(trafficOnOffNetTodaySuccess, trafficOnOffNetTodayFailure),
  TRAFFIC_SERVICE_PROVIDERS_FETCHED: mapReducers(trafficServiceProvidersSuccess, trafficServiceProvidersFailure),
  TRAFFIC_CONTENT_PROVIDERS_FETCHED: mapReducers(trafficContentProvidersSuccess, trafficContentProvidersFailure),
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

export const fetchByCity = createAction(TRAFFIC_BY_CITY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/city${qsBuilder(opts)}`)
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
  let data = {}
  let totals = {}
  return axios.get(`${analyticsBase()}/traffic/sp-contribution${qsBuilder(opts)}`)
  .then(parseResponseData)
  .then(action => {
    totals = action.data.totals
    return action.data.details
  })
  .then(details => Promise.all(details.map(datum => {
    const account = Number(datum.sp_account)
    const group = Number(datum.sp_group)

    if (opts.sp_group_ids && group) {
      data[group] = datum
      return axios.get(`${BASE_URL_AAA}/brands/${opts.brand}/accounts/${account}/groups/${group}`)
    } else {
      data[account] = datum
      return axios.get(`${BASE_URL_AAA}/brands/${opts.brand}/accounts/${account}`)
    }
  })))
  .then(resp => {
    return ({
      totals: totals,
      details: resp.map(resp => {
        let name = resp.data.name || `ID: ${resp.data.id}`
        return Object.assign({}, data[resp.data.id], {name: name})
      })
    })
  })
})

export const fetchContentProviders = createAction(TRAFFIC_CONTENT_PROVIDERS_FETCHED, (opts) => {
  let data = {}
  let totals = {}
  return axios.get(`${analyticsBase()}/traffic/cp-contribution${qsBuilder(opts)}`)
  .then(parseResponseData)
  .then(action => {
    totals = action.data.totals
    return action.data.details
  })
  .then(details => Promise.all(details.map(datum => {
    const account = Number(datum.account)
    const group = Number(datum.group)

    if (opts.group_ids && group) {
      data[group] = datum
      return axios.get(`${BASE_URL_AAA}/brands/${opts.brand}/accounts/${account}/groups/${group}`)
    } else {
      data[account] = datum
      return axios.get(`${BASE_URL_AAA}/brands/${opts.brand}/accounts/${account}`)
    }
  })))
  .then(resp => {
    return ({
      totals: totals,
      details: resp.map(resp => {
        let name = resp.data.name || `ID: ${resp.data.id}`
        return Object.assign({}, data[resp.data.id], {name: name})
      })
    })
  })
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
