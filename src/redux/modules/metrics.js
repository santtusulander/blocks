import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import {analyticsBase} from '../util'

const GROUP_METRICS_START_FETCH = 'GROUP_METRICS_START_FETCH'
const HOST_METRICS_START_FETCH = 'HOST_METRICS_START_FETCH'
const GROUP_METRICS_FETCHED = 'GROUP_METRICS_FETCHED'
const HOST_METRICS_FETCHED = 'HOST_METRICS_FETCHED'

const emptyMetrics = Immutable.Map({
  groupMetrics: Immutable.List(),
  hostMetrics: Immutable.List(),
  fetchingGroupMetrics: false,
  fetchingHostMetrics: false
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

const getTraffic = (datapoint) => {
  datapoint.historical_traffic = datapoint.historical_traffic.map(traffic => {
    traffic.timestamp = new Date(traffic.timestamp * 1000)
    return traffic;
  })
  datapoint.traffic = datapoint.traffic.map(traffic => {
    traffic.timestamp = new Date(traffic.timestamp * 1000)
    return traffic;
  })
  datapoint.totalTraffic = datapoint.traffic.reduce((total, traffic) => {
    return total + traffic.bytes
  }, 0)
  return datapoint;
}

// REDUCERS

export default handleActions({
  GROUP_METRICS_FETCHED: {
    next(state, action) {
      const data = action.payload.data.map(datapoint => getTraffic(datapoint))
      return state.merge({
        fetchingGroupMetrics: false,
        groupMetrics: Immutable.fromJS(data)
      })
    },
    throw(state) {
      return state.merge({
        fetchingGroupMetrics: false,
        groupMetrics: Immutable.List()
      })
    }
  },
  HOST_METRICS_FETCHED: {
    next(state, action) {
      const data = action.payload.data.map(datapoint => getTraffic(datapoint))
      return state.merge({
        fetchingHostMetrics: false,
        hostMetrics: Immutable.fromJS(data)
      })
    },
    throw(state) {
      return state.merge({
        fetchingHostMetrics: false,
        hostMetrics: Immutable.List()
      })
    }
  },
  GROUP_METRICS_START_FETCH: (state) => {
    return state.set('fetchingGroupMetrics', true)
  },
  HOST_METRICS_START_FETCH: (state) => {
    return state.set('fetchingHostMetrics', true)
  }
}, emptyMetrics)

// ACTIONS

export const fetchGroupMetrics = createAction(GROUP_METRICS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchHostMetrics = createAction(HOST_METRICS_FETCHED, (opts) => {
  return axios.get(`${analyticsBase}/metrics${qsBuilder(opts)}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startGroupFetching = createAction(GROUP_METRICS_START_FETCH)

export const startHostFetching = createAction(HOST_METRICS_START_FETCH)
