import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import {analyticsBase} from '../util'

const METRICS_START_FETCH = 'METRICS_START_FETCH'
const METRICS_FETCHED = 'METRICS_FETCHED'

const emptyMetrics = Immutable.Map({
  metrics: Immutable.List(),
  fetching: false
})

const qsBuilder = ({
  account,
  group,
  startDate,
  endDate
}) => {
  let qs = `?account=${account}`
  if(group) {
    qs += `&group=${group}`
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
  METRICS_FETCHED: {
    next(state, action) {
      const data = action.payload.data.map(datapoint => {
        datapoint.historical_traffic = datapoint.historical_traffic.map(traffic => {
          traffic.timestamp = new Date(traffic.timestamp * 1000)
          return traffic;
        })
        datapoint.traffic = datapoint.traffic.map(traffic => {
          traffic.timestamp = new Date(traffic.timestamp * 1000)
          return traffic;
        })
        return datapoint;
      })
      return state.merge({
        fetching: false,
        metrics: Immutable.fromJS(data)
      })
    },
    throw(state) {
      return state.merge({
        fetching: false,
        metrics: Immutable.List()
      })
    }
  },
  METRICS_START_FETCH: (state) => {
    return state.set('fetching', true)
  }
}, emptyMetrics)

// ACTIONS

export const fetchMetrics = createAction(METRICS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(METRICS_START_FETCH)
