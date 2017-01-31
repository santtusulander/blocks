import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'
import { TOP_PROVIDER_LENGTH } from '../../constants/dashboard'

const DASHBOARD_START_FETCH = 'DASHBOARD_START_FETCH'
const DASHBOARD_FINISH_FETCH = 'DASHBOARD_FINISH_FETCH'
const DASHBOARD_FETCHED = 'DASHBOARD_FETCHED'

const emptyDashboard = Immutable.Map({
  spDashboard: Immutable.Map(),
  fetching: false
})

// REDUCERS
export function dashboardFetchSuccess(state, action) {
  return state.merge({
    spDashboard: Immutable.fromJS(action.payload.data)
  })
}

export function dashboardFetchFailure(state) {
  return state.merge({
    spDashboard: Immutable.List()
  })
}

export function dashboardStartFetch(state){
  return state.set('fetching', true)
}

export function dashboardFinishFetch(state){
  return state.set('fetching', false)
}

export default handleActions({
  DASHBOARD_FETCHED: mapReducers(dashboardFetchSuccess, dashboardFetchFailure),
  DASHBOARD_START_FETCH: dashboardStartFetch,
  DASHBOARD_FINISH_FETCH: dashboardFinishFetch
}, emptyDashboard)

// ACTIONS
export const fetchDashboard = createAction(DASHBOARD_FETCHED, (opts) => {
  // cp-contribution endpoint expects a sp_account param instead of account
  let contributionOpts = Object.assign({}, opts)
  contributionOpts.sp_account = contributionOpts.account
  delete contributionOpts.account
  // Limit the amount of results for providers
  contributionOpts.limit = TOP_PROVIDER_LENGTH
  contributionOpts.show_detail = true

  // Combine data from many endpoints to serve dashboard
  return Promise.all([
    axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/on-off-net${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/cp-contribution${qsBuilder(contributionOpts)}`).then(parseResponseData)
  ])
  .then(axios.spread((traffic, trafficOnOffNet, countries, cpContribution) => {
    const trafficMap = Immutable.fromJS(traffic)
    const trafficOnOffNetMap = Immutable.fromJS(trafficOnOffNet)
    const countriesMap = Immutable.fromJS(countries)
    const cpContributionMap = Immutable.fromJS(cpContribution)

    const timeSpanInSeconds = opts.endDate - opts.startDate

    let bandwidth = []
    let latency = []
    let connections = []
    let cacheHit = []

    const trafficDetails = trafficMap.getIn(['data', 0, 'detail'], []).reduce((details, detail) => {
      const timestamp = detail.getIn(['timestamp'], null)
      const connectionsTotalDetail = detail.getIn(['connections', 'total'], null)
      const avg_fbl = detail.getIn(['avg_fbl'], '') || ''

      bandwidth.push({
        timestamp: timestamp,
        bits_per_second: detail.getIn(['transfer_rates', 'total'], null)
      })
      latency.push({
        timestamp: timestamp,
        avg_fbl: Number(avg_fbl.split(' ', 1))
      })
      connections.push({
        timestamp: timestamp,
        connections: connectionsTotalDetail,
        connections_per_second: connectionsTotalDetail / timeSpanInSeconds
      })
      cacheHit.push({
        timestamp: timestamp,
        chit_ratio: detail.getIn(['chit_ratio'], null)
      })

      details.bandwidth = bandwidth
      details.latency = latency
      details.connections = connections
      details.cacheHit = cacheHit

      return details
    }, {
      bandwidth: [],
      latency: [],
      connections: [],
      cacheHit: []
    })

    return {
      data: {
        traffic: {
          bytes: trafficMap.getIn(['data', 0, 'totals', 'bytes', 'total'], null),
          bytes_net_on: trafficOnOffNetMap.getIn(['data', 'net_on', 'bytes'], null),
          bytes_net_off: trafficOnOffNetMap.getIn(['data', 'net_off', 'bytes'], null),
          detail: trafficOnOffNetMap.getIn(['data', 'detail'], []).map(detail => {
            return {
              timestamp: Number(detail.getIn(['timestamp'], null)),
              bytes: detail.getIn(['total'], null),
              bytes_net_on: detail.getIn(['net_on', 'bytes'], null),
              bytes_net_off: detail.getIn(['net_off', 'bytes'], null)
            }
          }, {
            timestamp: null,
            bytes: null,
            bytes_net_on: null,
            bytes_net_off: null
          }).toJS()
        },
        bandwidth: {
          bits_per_second: trafficMap.getIn(['data', 0, 'totals', 'transfer_rates', 'average'], null),
          detail: trafficDetails.bandwidth
        },
        latency: {
          avg_fbl: Number(trafficMap.getIn(['data', 0, 'totals', 'avg_fbl']).split(' ', 1), null),
          detail: trafficDetails.latency
        },
        connections: {
          connections: trafficMap.getIn(['data', 0, 'totals', 'connections', 'total'], null),
          connections_per_second: trafficMap.getIn(['data', 0, 'totals', 'connections', 'per_second'], null),
          detail: trafficDetails.connections
        },
        cache_hit: {
          chit_ratio: trafficMap.getIn(['data', 0, 'totals', 'chit_ratio'], null),
          detail: trafficDetails.cacheHit
        },
        countries: countriesMap.getIn(['data', 'countries']),
        providers: cpContributionMap.getIn(['data', 'details'], Immutable.List()).map(provider => {
          const bytes = (
            provider.getIn(['http', 'net_off_bytes'], 0) +
            provider.getIn(['http', 'net_on_bytes'], 0) +
            provider.getIn(['https', 'net_off_bytes'], 0) +
            provider.getIn(['https', 'net_on_bytes'], 0)
          )
          const bits_per_second = (
            provider.getIn(['http', 'net_off_bps'], 0) +
            provider.getIn(['http', 'net_on_bps'], 0) +
            provider.getIn(['https', 'net_off_bps'], 0) +
            provider.getIn(['https', 'net_on_bps'], 0)
          )
          return {
            account: provider.getIn(['account'], null),
            bytes: bytes,
            bits_per_second: bits_per_second,
            detail: provider.getIn(['detail'], []),
            percent_total: provider.getIn(['percent_total'], null)
          }
        }).toJS()
      }
    }
  }))
})

export const startFetching = createAction(DASHBOARD_START_FETCH)

export const finishFetching = createAction(DASHBOARD_FINISH_FETCH)
