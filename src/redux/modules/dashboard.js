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
  let contributionOpts = Object.assign({}, opts)
  // cp-contribution endpoint expects a sp_account param instead of account
  contributionOpts.sp_account = contributionOpts.account
  // Remove account parameter or the query will fail
  delete contributionOpts.account
  // Limit the amount of results for providers
  contributionOpts.limit = TOP_PROVIDER_LENGTH
  // Show detailed data for providers
  contributionOpts.show_detail = true

  // Combine data from many endpoints to serve dashboard
  return Promise.all([
    axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/on-off-net${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`).then(parseResponseData),
    axios.get(`${analyticsBase()}/traffic/cp-contribution${qsBuilder(contributionOpts)}`).then(parseResponseData)
  ])
  .then(axios.spread(processDashboardData))
})

export const startFetching = createAction(DASHBOARD_START_FETCH)

export const finishFetching = createAction(DASHBOARD_FINISH_FETCH)


// DATA PROCESSING

// This function is used for combining the data coming from several endpoints into
// a single object, which get passed to the dashboard container. This was done
// so that there was no need to do a lot of changes in the container, which used
// previously the sp-dashboard endpoint and received an ob
export function processDashboardData(traffic, trafficOnOffNet, countries, cpContribution) {
  // Creating Immutable objects for easier error handling
  const trafficMap = Immutable.fromJS(traffic)
  const trafficOnOffNetMap = Immutable.fromJS(trafficOnOffNet)
  const countriesMap = Immutable.fromJS(countries)
  const cpContributionMap = Immutable.fromJS(cpContribution)

  // Creates detail arrays for bandwidth, latency, connections and cache hit
  const trafficDetails = trafficMap.getIn(['data', 0, 'detail'], []).reduce((details, detail) => {
    const timestamp = detail.getIn(['timestamp'], null)
    const avg_fbl = detail.getIn(['avg_fbl'], '') || ''

    details.bandwidth.push({
      timestamp: timestamp,
      bits_per_second: detail.getIn(['transfer_rates', 'total'], null)
    })
    details.latency.push({
      timestamp: timestamp,
      avg_fbl: Number(avg_fbl.split(' ', 1))
    })
    details.connections.push({
      timestamp: timestamp,
      connections: detail.getIn(['connections', 'total'], null),
      connections_per_second: detail.getIn(['connections', 'per_second'], null)
    })
    details.cacheHit.push({
      timestamp: timestamp,
      chit_ratio: detail.getIn(['chit_ratio'], null)
    })

    return details
  }, {
    bandwidth: [],
    latency: [],
    connections: [],
    cacheHit: []
  })

  // Final data object returned
  return {
    data: {
      traffic: {
        bytes: trafficMap.getIn(['data', 0, 'totals', 'bytes', 'total'], null),
        bytes_net_on: trafficOnOffNetMap.getIn(['data', 'net_on', 'bytes'], null),
        bytes_net_off: trafficOnOffNetMap.getIn(['data', 'net_off', 'bytes'], null),
        detail: trafficOnOffNetMap.getIn(['data', 'detail'], Immutable.List()).map(detail => {
          return {
            timestamp: Number(detail.getIn(['timestamp'], null)),
            bytes: detail.getIn(['total'], null),
            bytes_net_on: detail.getIn(['net_on', 'bytes'], null),
            bytes_net_off: detail.getIn(['net_off', 'bytes'], null)
          }
        }).toJS()
      },
      bandwidth: {
        bits_per_second: trafficMap.getIn(['data', 0, 'totals', 'transfer_rates', 'average'], null),
        detail: trafficDetails.bandwidth
      },
      latency: {
        avg_fbl: Number(trafficMap.getIn(['data', 0, 'totals', 'avg_fbl'], '').split(' ', 1)),
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
      countries: countriesMap.getIn(['data', 'countries'], []),
      providers: cpContributionMap.getIn(['data', 'details'], Immutable.List()).map(provider => {
        // Calculate bytes and bits_per_second since these are not returned as totals
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
}
