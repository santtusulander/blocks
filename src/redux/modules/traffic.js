import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import {analyticsBase} from '../util'

const TRAFFIC_START_FETCH = 'TRAFFIC_START_FETCH'
const TRAFFIC_FINISH_FETCH = 'TRAFFIC_FINISH_FETCH'
const TRAFFIC_BY_TIME_FETCHED = 'TRAFFIC_BY_TIME_FETCHED'
const TRAFFIC_BY_COUNTRY_FETCHED = 'TRAFFIC_BY_COUNTRY_FETCHED'
const TRAFFIC_TOTAL_EGRESS_FETCHED = 'TRAFFIC_TOTAL_EGRESS_FETCHED'

const emptyTraffic = Immutable.Map({
  byTime: Immutable.List(),
  byCountry: Immutable.List(),
  fetching: false,
  totalEgress: 0
})

const qsBuilder = ({
  account,
  group,
  property,
  startDate,
  endDate
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
  return qs
}

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
        totalEgress: Immutable.List()
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
  return axios.get(`${analyticsBase}/traffic/time${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByCountry = createAction(TRAFFIC_BY_COUNTRY_FETCHED, (opts) => {
  return axios.get(`${analyticsBase}/traffic/country${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchTotalEgress = createAction(TRAFFIC_TOTAL_EGRESS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase}/traffic/total${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(TRAFFIC_START_FETCH)

export const finishFetching = createAction(TRAFFIC_FINISH_FETCH)
