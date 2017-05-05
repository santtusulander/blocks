import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import { fromJS, List } from 'immutable'
import moment from 'moment'

import { analyticsBase, qsBuilder, mapReducers } from '../util'

const VISITORS_START_FETCH = 'VISITORS_START_FETCH'
const VISITORS_FINISH_FETCH = 'VISITORS_FINISH_FETCH'
const VISITORS_BY_TIME_FETCHED = 'VISITORS_BY_TIME_FETCHED'
const VISITORS_BY_COUNTRY_FETCHED = 'VISITORS_BY_COUNTRY_FETCHED'
const VISITORS_BY_CITY_FETCHED = 'VISITORS_BY_CITY_FETCHED'
const VISITORS_BY_BROWSER_FETCHED = 'VISITORS_BY_BROWSER_FETCHED'
const VISITORS_RESET = 'VISITORS_RESET'
const VISITORS_BY_OS_FETCHED = 'VISITORS_BY_OS_FETCHED'

export const emptyTraffic = fromJS({
  byBrowser: {browsers: []},
  byCity: [],
  byCountry: {countries: []},
  byOS: {os: []},
  byTime: [],
  byTimeAverage: 0,
  fetching: false
})

// REDUCERS

export function fetchedByTimeSuccess(state, action) {
  const total = action.payload.data.reduce((totalData, record) => totalData + (record.uniq_vis || 0), 0)
  const average = action.payload.data.length ? total / action.payload.data.length : 0;
  return state.merge({
    byTime: fromJS(action.payload.data.map(datapoint => {
      datapoint.timestamp = moment(datapoint.timestamp, 'X').toDate()
      return datapoint
    })),
    byTimeAverage: average
  })
}

export function fetchedByTimeFailure(state) {
  return state.merge({
    byTime: List()
  })
}

export function fetchedByCitySuccess(state, action) {
  return state.merge({
    byCity: fromJS(action.payload.data.cities)
  })
}

export function fetchedByCityFailure(state) {
  return state.merge({
    byCity: List()
  })
}

export function fetchedByCountrySuccess(state, action) {
  return state.merge({
    byCountry: fromJS(action.payload.data)
  })
}

export function fetchedByCountryFailure(state) {
  return state.merge({
    byCountry: fromJS({countries: []})
  })
}

export function fetchedByBrowserSuccess(state, action) {
  return state.merge({
    byBrowser: fromJS(action.payload.data)
  })
}

export function fetchedByBrowserFailure(state) {
  return state.merge({
    byBrowser: fromJS({browsers: []})
  })
}

export function fetchedByOSSuccess(state, action) {
  return state.merge({
    byOS: fromJS(action.payload.data)
  })
}

export function fetchedByOSFailure(state) {
  return state.merge({
    byOS: fromJS({os: []})
  })
}

export function reset(state) {
  return state.merge({
    byTime: List(),
    byTimeAverage: 0,
    byCountry: fromJS({countries: []}),
    byBrowser: fromJS({browsers: []}),
    byOS: fromJS({os: []})
  })
}
export function startedFetch(state) {
  return state.set('fetching', true)
}

export function finishedFetch(state) {
  return state.set('fetching', false)
}

export default handleActions({
  VISITORS_BY_TIME_FETCHED: mapReducers(fetchedByTimeSuccess, fetchedByOSFailure),
  VISITORS_BY_CITY_FETCHED: mapReducers(fetchedByCitySuccess, fetchedByCityFailure),
  VISITORS_BY_COUNTRY_FETCHED: mapReducers(fetchedByCountrySuccess, fetchedByCountryFailure),
  VISITORS_BY_BROWSER_FETCHED: mapReducers(fetchedByBrowserSuccess, fetchedByBrowserFailure),
  VISITORS_BY_OS_FETCHED: mapReducers(fetchedByOSSuccess, fetchedByOSFailure),
  VISITORS_RESET: reset,
  VISITORS_START_FETCH: startedFetch,
  VISITORS_FINISH_FETCH: finishedFetch
}, emptyTraffic)

// ACTIONS

export const fetchByTime = createAction(VISITORS_BY_TIME_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/time${qsBuilder(opts)}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchByCity = createAction(VISITORS_BY_CITY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/city${qsBuilder(opts)}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchByCountry = createAction(VISITORS_BY_COUNTRY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/country${qsBuilder(opts)}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchByBrowser = createAction(VISITORS_BY_BROWSER_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/browser${qsBuilder(opts)}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const fetchByOS = createAction(VISITORS_BY_OS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/os${qsBuilder(opts)}`)
  .then((res) => {
    if (res) {
      return res.data;
    }
  });
})

export const visitorsReset = createAction(VISITORS_RESET)

export const startFetching = createAction(VISITORS_START_FETCH)

export const finishFetching = createAction(VISITORS_FINISH_FETCH)
