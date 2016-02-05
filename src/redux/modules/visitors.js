import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {analyticsBase} from '../util'

const VISITORS_START_FETCH = 'VISITORS_START_FETCH'
const VISITORS_FINISH_FETCH = 'VISITORS_FINISH_FETCH'
const VISITORS_BY_TIME_FETCHED = 'VISITORS_BY_TIME_FETCHED'
const VISITORS_BY_COUNTRY_FETCHED = 'VISITORS_BY_COUNTRY_FETCHED'
const VISITORS_BY_BROWSER_FETCHED = 'VISITORS_BY_BROWSER_FETCHED'
const VISITORS_BY_OS_FETCHED = 'VISITORS_BY_OS_FETCHED'

const emptyTraffic = Immutable.Map({
  byBrowser: Immutable.List(),
  byCountry: Immutable.List(),
  byOS: Immutable.List(),
  byTime: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  VISITORS_BY_TIME_FETCHED: {
    next(state, action) {
      return state.merge({
        byTime: Immutable.fromJS(action.payload.data)
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
        byCountry: Immutable.List()
      })
    }
  },
  VISITORS_BY_BROWSER_FETCHED: {
    next(state, action) {
      return state.merge({
        byCountry: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        byCountry: Immutable.List()
      })
    }
  },
  VISITORS_BY_OS_FETCHED: {
    next(state, action) {
      return state.merge({
        byCountry: Immutable.fromJS(action.payload.data)
      })
    },
    throw(state) {
      return state.merge({
        byCountry: Immutable.List()
      })
    }
  },
  VISITORS_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  VISITORS_FINISH_FETCH: (state) => {
    return state.set('fetching', false)
  }
}, emptyTraffic)

// ACTIONS

export const fetchByTime = createAction(VISITORS_BY_TIME_FETCHED, () => {
  return axios.get(`${analyticsBase}/visitors/time`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByCountry = createAction(VISITORS_BY_COUNTRY_FETCHED, () => {
  return axios.get(`${analyticsBase}/visitors/country`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByBrowser = createAction(VISITORS_BY_BROWSER_FETCHED, () => {
  return axios.get(`${analyticsBase}/visitors/browser`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchByOS = createAction(VISITORS_BY_OS_FETCHED, () => {
  return axios.get(`${analyticsBase}/visitors/os`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(VISITORS_START_FETCH)

export const finishFetching = createAction(VISITORS_FINISH_FETCH)
