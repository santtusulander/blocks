import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {analyticsBase} from '../util'

const TRAFFIC_START_FETCH = 'TRAFFIC_START_FETCH'
const TRAFFIC_FINISH_FETCH = 'TRAFFIC_FINISH_FETCH'
const TRAFFIC_BY_TIME_FETCHED = 'TRAFFIC_BY_TIME_FETCHED'
const TRAFFIC_BY_COUNTRY_FETCHED = 'TRAFFIC_BY_COUNTRY_FETCHED'

const emptyTraffic = Immutable.Map({
  byTime: Immutable.List(),
  byCountry: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  TRAFFIC_BY_TIME_FETCHED: {
    next(state, action) {
      return state.merge({
        byTime: Immutable.fromJS(action.payload)
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
        byCountry: Immutable.fromJS(action.payload)
      })
    },
    throw(state) {
      return state.merge({
        byCountry: Immutable.List()
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

export const fetchByTime = createAction(TRAFFIC_BY_TIME_FETCHED, () => {
  return axios.get(`${analyticsBase}/traffic/time`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByCountry = createAction(TRAFFIC_BY_COUNTRY_FETCHED, () => {
  return axios.get(`${analyticsBase}/traffic/country`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(TRAFFIC_START_FETCH)

export const finishFetching = createAction(TRAFFIC_FINISH_FETCH)
