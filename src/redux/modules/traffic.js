import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import { analyticsBase, qsBuilder, parseResponseData } from '../util'

const TRAFFIC_START_FETCH = 'TRAFFIC_START_FETCH'
const TRAFFIC_FINISH_FETCH = 'TRAFFIC_FINISH_FETCH'
const TRAFFIC_BY_TIME_FETCHED = 'TRAFFIC_BY_TIME_FETCHED'
const TRAFFIC_BY_COUNTRY_FETCHED = 'TRAFFIC_BY_COUNTRY_FETCHED'
const TRAFFIC_TOTAL_EGRESS_FETCHED = 'TRAFFIC_TOTAL_EGRESS_FETCHED'
const TRAFFIC_ON_OFF_NET_FETCHED = 'TRAFFIC_ON_OFF_NET_FETCHED'
const TRAFFIC_ON_OFF_NET_TODAY_FETCHED = 'TRAFFIC_ON_OFF_NET_TODAY_FETCHED'
const TRAFFIC_SERVICE_PROVIDERS_FETCHED = 'TRAFFIC_SERVICE_PROVIDERS_FETCHED'
const TRAFFIC_STORAGE_FETCHED = 'TRAFFIC_STORAGE_FETCHED'

const emptyTraffic = Immutable.Map({
  byTime: Immutable.List(),
  byCountry: Immutable.List(),
  fetching: false,
  onOffNet: Immutable.Map(),
  onOffNetToday: Immutable.Map(),
  serviceProviders: Immutable.List(),
  storage: Immutable.List(),
  totalEgress: 0
})

// REDUCERS

export default handleActions({
  TRAFFIC_BY_TIME_FETCHED: {
    next(state, action) {
      return state.merge({
        byTime: Immutable.fromJS(action.payload.data.map(datapoint => {
          datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
          return datapoint
        }))
      })
    },
    throw(state) {
      return state.merge({
        byTime: Immutable.List()
      })
    }
  },
  TRAFFIC_BY_COUNTRY_FETCHED: {
    next(state, action) {
      return state.merge({
        byCountry: Immutable.fromJS(action.payload.data.countries)
      })
    },
    throw(state) {
      return state.merge({
        byCountry: Immutable.List()
      })
    }
  },
  TRAFFIC_TOTAL_EGRESS_FETCHED: {
    next(state, action) {
      return state.merge({
        totalEgress: Immutable.fromJS(action.payload.data.bytes)
      })
    },
    throw(state) {
      return state.merge({
        totalEgress: 0
      })
    }
  },
  TRAFFIC_ON_OFF_NET_FETCHED: {
    next(state, action) {
      action.payload.data.detail = action.payload.data.detail.map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
        return datapoint
      })
      return state.merge({
        onOffNet: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        onOffNet: Immutable.Map()
      })
    }
  },
  TRAFFIC_ON_OFF_NET_TODAY_FETCHED: {
    next(state, action) {
      return state.merge({
        onOffNetToday: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        onOffNetToday: Immutable.Map()
      })
    }
  },
  TRAFFIC_SERVICE_PROVIDERS_FETCHED: {
    next(state, action) {
      return state.merge({
        serviceProviders: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        serviceProviders: Immutable.Map()
      })
    }
  },
  TRAFFIC_STORAGE_FETCHED: {
    next(state, action) {
      action.payload.data = action.payload.data.map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
        return datapoint
      })
      return state.merge({
        storage: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        storage: Immutable.Map()
      })
    }
  },
  TRAFFIC_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  TRAFFIC_FINISH_FETCH: (state) => {
    return state.set('fetching', false)
  }
}, emptyTraffic)

// ACTIONS

export const fetchByTime = createAction(TRAFFIC_BY_TIME_FETCHED, (opts) => {
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
  return axios.get(`${analyticsBase()}/traffic/service-provider${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchOnOffNetToday = createAction(TRAFFIC_ON_OFF_NET_TODAY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/traffic/service-provider${qsBuilder(opts)}`)
  .then(parseResponseData);
})

export const fetchServiceProviders = createAction(TRAFFIC_SERVICE_PROVIDERS_FETCHED, () => {
  return Promise.resolve({data: [
    {
      "name": "Vodafone",
      "http": {
        "net_on": 25000,
        "net_on_bps": 25000,
        "net_off": 75000,
        "net_off_bps": 75000
      },
      "https": {
        "net_on": 50000,
        "net_on_bps": 50000,
        "net_off": 100000,
        "net_off_bps": 100000
      },
      "countries": [
        {
          "name": "Germany",
          "code": "GER",
          "bytes": 50000,
          "bits_per_second": 50000,
          "percent_total": 0.35
        },
        {
          "name": "France",
          "code": "FRA",
          "bytes": 250000,
          "bits_per_second": 250000,
          "percent_total": 0.20
        }
      ]
    },
    {
      "name": "Telstra",
      "http": {
        "net_on": 50000,
        "net_on_bps": 50000,
        "net_off": 25000,
        "net_off_bps": 25000
      },
      "https": {
        "net_on": 25000,
        "net_on_bps": 25000,
        "net_off": 50000,
        "net_off_bps": 50000
      },
      "countries": [
        {
          "name": "Australia",
          "code": "AUS",
          "bytes": 150000,
          "bits_per_second": 150000,
          "percent_total": 0.30
        }
      ]
    }
  ]})
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
