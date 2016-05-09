import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'
import axios from 'axios'

const REPORTS_START_FETCH = 'REPORTS_START_FETCH'
const REPORTS_FINISH_FETCH = 'REPORTS_FINISH_FETCH'
const REPORTS_URL_METRICS_FETCHED = 'REPORTS_URL_METRICS_FETCHED'
const REPORTS_FILE_ERROR_METRICS_FETCHED = 'REPORTS_FILE_ERROR_METRICS_FETCHED'

import { analyticsBase, parseResponseData, qsBuilder } from '../util'

const emptyReports = Immutable.Map({
  fetching: false,
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  urlMetrics: Immutable.List()
})

// REDUCERS

export default handleActions({
  REPORTS_URL_METRICS_FETCHED: {
    next(state, action) {
      return state.merge({
        urlMetrics: Immutable.fromJS(action.payload)
      })
    },
    throw(state) {
      return state.merge({
        urlMetrics: Immutable.List()
      })
    }
  },
  REPORTS_FILE_ERROR_METRICS_FETCHED: {
    next(state, action) {
      return state.merge({
        fileErrorSummary: Immutable.fromJS(action.payload.num_errors),
        fileErrorURLs: Immutable.fromJS(action.payload.url_details)
      })
    },
    throw(state) {
      return state.merge({
        fileErrorSummary: Immutable.Map(),
        fileErrorURLs: Immutable.List()
      })
    }
  },
  REPORTS_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  REPORTS_FINISH_FETCH: (state) => {
    return state.set('fetching', false)
  }
}, emptyReports)

// ACTIONS

export const fetchURLMetrics = createAction(REPORTS_URL_METRICS_FETCHED, () => {
  return Promise.resolve([
    {
      url: 'www.abc.com',
      bytes: 1000,
      requests: 287536
    },
    {
      url: 'www.sirut.com/ksdjg/sefksgh/ksjehfsdg.jpg',
      bytes: 2000,
      requests: 467567
    },
    {
      url: 'www.rtytyu.com/dfgfghfgh/sdf/dfgdr.mp4',
      bytes: 3000,
      requests: 343456
    }
  ])
})

export const fetchFileErrorsMetrics = createAction(REPORTS_FILE_ERROR_METRICS_FETCHED, opts => {
  // return axios.get(`${analyticsBase}/file-errors${qsBuilder(opts)}`)
  // .then(parseResponseData);
  return Promise.resolve({
    "num_errors": {
      "e404": {
        "http": 1,
        "https": 2,
        "total": 3
      },
      "e500": {
        "http": 3,
        "https": 1,
        "total": 4
      }
    },
    "url_details": [
      {
        "status_code": "404",
        "url": "idean.com/a.png",
        "bytes": 1848238,
        "requests": 17498,
        "service_type": "http"
      },
      {
        "status_code": "500",
        "url": "idean.com/c.png",
        "bytes": 1559828,
        "requests": 14815,
        "service_type": "http"
      },
      {
        "status_code": "404",
        "url": "idean.com/b.png",
        "bytes": 1538539,
        "requests": 15949,
        "service_type": "https"
      },
      {
        "status_code": "500",
        "url": "idean.com/d.png",
        "bytes": 1428522,
        "requests": 19554,
        "service_type": "http"
      },
      {
        "status_code": "500",
        "url": "idean.com/a.png",
        "bytes": 95490,
        "requests": 650,
        "service_type": "https"
      },
      {
        "status_code": "404",
        "url": "idean.com/a.png",
        "bytes": 31740,
        "requests": 254,
        "service_type": "https"
      },
      {
        "status_code": "500",
        "url": "idean.com/a.png",
        "bytes": 1344,
        "requests": 114,
        "service_type": "http"
      }
    ]
  })
})

export const startFetching = createAction(REPORTS_START_FETCH)

export const finishFetching = createAction(REPORTS_FINISH_FETCH)
