import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
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
  group
}) => {
  let qs = `?account=${account}`
  if(group) {
    qs += `&group=${group}`
  }
  return qs
}

// REDUCERS

export default handleActions({
  METRICS_FETCHED: {
    next(state, action) {
      return state.merge({
        fetching: false,
        metrics: Immutable.fromJS(action.payload.data)
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
