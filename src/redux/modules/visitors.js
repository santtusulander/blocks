import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import moment from 'moment'

import {analyticsBase} from '../util'

const VISITORS_START_FETCH = 'VISITORS_START_FETCH'
const VISITORS_FINISH_FETCH = 'VISITORS_FINISH_FETCH'
const VISITORS_BY_TIME_FETCHED = 'VISITORS_BY_TIME_FETCHED'
const VISITORS_BY_COUNTRY_FETCHED = 'VISITORS_BY_COUNTRY_FETCHED'
const VISITORS_BY_BROWSER_FETCHED = 'VISITORS_BY_BROWSER_FETCHED'
const VISITORS_RESET = 'VISITORS_RESET'
const VISITORS_BY_OS_FETCHED = 'VISITORS_BY_OS_FETCHED'

const emptyTraffic = Immutable.fromJS({
  byBrowser: {browsers: []},
  byCountry: {countries: []},
  byOS: {os: []},
  byTime: [],
  fetching: false
})

const qsBuilder = ({
  account,
  group,
  property,
  startDate,
  endDate,
  granularity,
  aggregate_granularity,
  max_countries
}) => {
  let qs = `?account=${account}`
  if(group) {
    qs += `&group=${group}`
  }
  if(property) {
    qs += `&property=${property}`
  }
  if(startDate) {
    qs += `&start=${startDate}`
  }
  if(endDate) {
    qs += `&end=${endDate}`
  }
  if(granularity) {
    qs += `&granularity=${granularity}`
  }
  if(aggregate_granularity) {
    qs += `&aggregate_granularity=${aggregate_granularity}`
  }
  if(max_countries) {
    qs += `&max_countries=${max_countries}`
  }
  return qs
}

// REDUCERS

export default handleActions({
  VISITORS_BY_TIME_FETCHED: {
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
  VISITORS_BY_COUNTRY_FETCHED: {
    next(state, action) {
      return state.merge({
        byCountry: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        byCountry: Immutable.fromJS({countries: []})
      })
    }
  },
  VISITORS_BY_BROWSER_FETCHED: {
    next(state, action) {
      return state.merge({
        byBrowser: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        byBrowser: Immutable.fromJS({browsers: []})
      })
    }
  },
  VISITORS_BY_OS_FETCHED: {
    next(state, action) {
      return state.merge({
        byOS: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        byOS: Immutable.fromJS({os: []})
      })
    }
  },
  VISITORS_RESET: (state) => {
    return state.merge({
      byTime: Immutable.List(),
      byCountry: Immutable.fromJS({countries: []}),
      byBrowser: Immutable.fromJS({browsers: []}),
      byOS: Immutable.fromJS({os: []})
    })
  },
  VISITORS_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  VISITORS_FINISH_FETCH: (state) => {
    return state.set('fetching', false)
  }
}, emptyTraffic)

// ACTIONS

export const fetchByTime = createAction(VISITORS_BY_TIME_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/time${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByCountry = createAction(VISITORS_BY_COUNTRY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/country${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByBrowser = createAction(VISITORS_BY_BROWSER_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/browser${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByOS = createAction(VISITORS_BY_OS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase()}/visitors/os${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const visitorsReset = createAction(VISITORS_RESET)

export const startFetching = createAction(VISITORS_START_FETCH)

export const finishFetching = createAction(VISITORS_FINISH_FETCH)
