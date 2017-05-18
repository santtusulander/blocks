import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import { analyticsBase, parseResponseData, qsBuilder, mapReducers } from '../util'
import {
  TOP_PROVIDER_LENGTH,
  BRAND_DASHBOARD_TOP_PROVIDER_LENGTH,
  BRAND_DASHBOARD_ACCOUNTS_TO_EXCLUDE
} from '../../constants/dashboard'
import { ACCOUNT_TYPE_CONTENT_PROVIDER, ACCOUNT_TYPE_CLOUD_PROVIDER } from '../../constants/account-management-options'

const DASHBOARD_START_FETCH = 'DASHBOARD_START_FETCH'
const DASHBOARD_FINISH_FETCH = 'DASHBOARD_FINISH_FETCH'
const DASHBOARD_FETCHED = 'DASHBOARD_FETCHED'

const emptyDashboard = Immutable.Map({
  dashboard: Immutable.Map(),
  fetching: false
})

// REDUCERS
export function dashboardFetchSuccess(state, action) {
  return state.merge({
    dashboard: Immutable.fromJS(action.payload.data)
  })
}

export function dashboardFetchFailure(state) {
  return state.merge({
    dashboard: Immutable.List()
  })
}

export function dashboardStartFetch(state) {
  return state.set('fetching', true)
}

export function dashboardFinishFetch(state) {
  return state.set('fetching', false)
}

export default handleActions({
  DASHBOARD_FETCHED: mapReducers(dashboardFetchSuccess, dashboardFetchFailure),
  DASHBOARD_START_FETCH: dashboardStartFetch,
  DASHBOARD_FINISH_FETCH: dashboardFinishFetch
}, emptyDashboard)

// ACTIONS
export const fetchDashboard = createAction(DASHBOARD_FETCHED, (opts, account_type) => {
  const contributionOpts = Object.assign({}, opts, {granularity: 'day'})
  const allContributionOpts = Object.assign({}, opts, {granularity: 'day'})

  const dashboardRequests = []

  // Limit the amount of results for providers
  contributionOpts.limit = TOP_PROVIDER_LENGTH
  // Show detailed data for providers
  contributionOpts.show_detail = true

  // Build Promise object with different data depending on account type
  // PLEASE NOTE! processDashboardData() always expects 7 arguments

  if (account_type === ACCOUNT_TYPE_CONTENT_PROVIDER) {
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`).then(parseResponseData))
    // sp-contribution endpoint expects a sp_account_ids param instead of account
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/time${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/sp-contribution${qsBuilder(contributionOpts)}`).then(parseResponseData))
    dashboardRequests.push(null)
    dashboardRequests.push(null)
    dashboardRequests.push(null)

  } else if (account_type === ACCOUNT_TYPE_CLOUD_PROVIDER) {
    contributionOpts.limit = BRAND_DASHBOARD_TOP_PROVIDER_LENGTH
    contributionOpts.show_detail = true

    allContributionOpts.limit = 0
    allContributionOpts.show_detail = true

    /* Exclude demo accounts */
    if (process.env.NODE_ENV === 'production') {
      contributionOpts.exclude_accounts = BRAND_DASHBOARD_ACCOUNTS_TO_EXCLUDE
      allContributionOpts.exclude_accounts = BRAND_DASHBOARD_ACCOUNTS_TO_EXCLUDE
    }
    
    dashboardRequests.push(null)
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(null)
    dashboardRequests.push(null)
    dashboardRequests.push(null)
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/cp-contribution${qsBuilder(contributionOpts)}`).then(parseResponseData))
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/sp-contribution${qsBuilder(allContributionOpts)}`).then(parseResponseData))
  } else {
    // cp-contribution endpoint expects a sp_account param instead of account
    contributionOpts.sp_account = contributionOpts.account
    // Remove account parameter or the query will fail
    delete contributionOpts.account

    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/country${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(null)
    dashboardRequests.push(null)
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/on-off-net${qsBuilder(opts)}`).then(parseResponseData))
    dashboardRequests.push(axios.get(`${analyticsBase()}/traffic/cp-contribution${qsBuilder(contributionOpts)}`).then(parseResponseData))
    dashboardRequests.push(null)
  }

  // Combine data from many endpoints to serve dashboard
  return Promise.all(dashboardRequests)
  .then(axios.spread(processDashboardData))
})
export const startFetching = createAction(DASHBOARD_START_FETCH)

export const finishFetching = createAction(DASHBOARD_FINISH_FETCH)

// DATA PROCESSING

// This function is used for combining the data coming from several endpoints into
// a single object, which get passed to the dashboard container. This was done
// so that there was no need to do a lot of changes in the container, which
// previously used sp-dashboard endpoint that did all this aggregation for us
export function processDashboardData(traffic, countries, trafficTime, spContribution, trafficOnOffNet, cpContribution, allSpContribution) {
  // Creating Immutable objects for easier error handling
  const trafficMap = Immutable.fromJS(traffic || {})
  const countriesMap = Immutable.fromJS(countries)
  const trafficTimeMap = Immutable.fromJS(trafficTime || {})
  const trafficOnOffNetMap = Immutable.fromJS(trafficOnOffNet || {})
  const contributionMap = Immutable.fromJS(cpContribution ? cpContribution : spContribution)
  const allSpContributionMap = Immutable.fromJS(allSpContribution || {})

  // Creates detail arrays for bandwidth, latency, connections and cache hit
  const trafficDetails =  trafficMap.getIn(['data', 0, 'detail'], []).reduce((details, detail) => {
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

  // Build trafficData based on account type, since the structure is different
  let trafficData = {}

  if (trafficTimeMap.size !== 0) {
    trafficData = {
      bytes: trafficMap.getIn(['data', 0, 'totals', 'bytes', 'total'], null),
      http: trafficTimeMap.getIn(['data', 'totals', 0, 'bytes_percentage'], null),
      https: trafficTimeMap.getIn(['data', 'totals', 1, 'bytes_percentage'], null),
      // Combine http and https records with groupBy. toIndexedSeq resets the
      // array keys back to 0, 1, 2...
      detail: trafficTimeMap.getIn(['data', 'details'], Immutable.List())
        .groupBy(detail => detail.get('timestamp')).map(detail => {
          return {
            timestamp: detail.getIn([0, 'timestamp'], null),
            bytes: detail.getIn([0, 'bytes'], null) + detail.getIn([1, 'bytes'], null),
            bytes_http: detail.getIn([0, 'bytes'], null),
            bytes_https: detail.getIn([1, 'bytes'], null)
          }
        }).toIndexedSeq()
    }
  } else {
    trafficData = {
      bytes: trafficMap.getIn(['data', 0, 'totals', 'bytes', 'total'], null),
      bytes_net_on: trafficOnOffNetMap.getIn(['data', 'net_on', 'percent_total'], null) * 100,
      bytes_net_off: trafficOnOffNetMap.getIn(['data', 'net_off', 'percent_total'], null) * 100,
      detail: trafficOnOffNetMap.getIn(['data', 'detail'], Immutable.List()).map(detail => {
        return {
          timestamp: detail.getIn(['timestamp'], null),
          bytes: detail.getIn(['total'], null),
          bytes_net_on: detail.getIn(['net_on', 'bytes'], null),
          bytes_net_off: detail.getIn(['net_off', 'bytes'], null)
        }
      })
    }
  }

  // Final data object returned
  return {
    data: {
      traffic: trafficData,
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
      providers: contributionMap.getIn(['data', 'details'], Immutable.List()).map(provider => {
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
          // Use different provider account id depending on main account type
          account: provider.getIn([cpContribution ? 'account' : 'sp_account'], null),
          bytes: bytes,
          bits_per_second: bits_per_second,
          detail: provider.getIn(['detail'], []),
          percent_total: provider.getIn(['percent_total'], null)
        }
      }).toJS(),
      cp_providers: cpContribution && Immutable.fromJS(cpContribution).getIn(['data', 'details'], Immutable.List()).map(provider => {
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
          // Use different provider account id depending on main account type
          account: provider.getIn(['account'], null),
          name: provider.getIn(['name'], null),
          bytes: bytes,
          bits_per_second: bits_per_second,
          detail: provider.getIn(['detail'], []),
          percent_total: provider.getIn(['percent_total'], null)
        }
      }).toJS(),
      all_sp_providers: allSpContribution && {
        rawDetails: allSpContribution.data.details,

        total: allSpContributionMap.getIn(['data', 'totals']),
        detail: allSpContributionMap.getIn(['data', 'details'], Immutable.List()).map(provider => {
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
            // Use different provider account id depending on main account type
            account: provider.getIn(['sp_account'], null),
            name: provider.getIn(['name'], null),
            bytes: bytes,
            bits_per_second: bits_per_second,
            detail: provider.getIn(['detail'], []),
            percent_total: provider.getIn(['percent_total'], null)
          }
        }).toJS()
      }
    }
  }
}
