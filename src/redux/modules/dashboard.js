import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import { Immutable } from 'immutable'
import moment from 'moment'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'

const DASHBOARD_START_FETCH = 'DASHBOARD_START_FETCH'
const DASHBOARD_FINISH_FETCH = 'DASHBOARD_FINISH_FETCH'
const DASHBOARD_FETCHED = 'DASHBOARD_FETCHED'
//
// const emptyDashboard = Immutable.Map({
//   dashboard: Immutable.List(),
//   fetching: false
// })

// ACTIONS
// console.log(`${analyticsBase()}/sp-dashboard${}`)
export const fetchDashboard = createAction(DASHBOARD_FETCHED, (opts) => {
  console.log(opts)
  console.log(`${analyticsBase()}/sp-dashboard`)
})

export const startFetching = createAction(DASHBOARD_START_FETCH)

export const finishFetching = createAction(DASHBOARD_FINISH_FETCH)
