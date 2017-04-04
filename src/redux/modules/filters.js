import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'
import moment from 'moment'

import { analyticsBase, qsBuilder, BASE_URL_AAA, mapReducers, parseResponseData } from '../util'
import {
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CONTENT_PROVIDER
} from '../../constants/account-management-options'

import DateRanges from '../../constants/date-ranges'

import {
  getAnalysisStatusCodes,
  getAnalysisErrorCodes
} from '../../util/status-codes'

export const defaultFilters =  Immutable.fromJS({
  dateRange: {
    startDate: moment().utc().startOf('month'),
    endDate: moment().utc().endOf('day')
  },
  customDateRange: {
    startDate: moment().utc().startOf('day'),
    endDate: moment().utc().endOf('day')
  },
  includeComparison: false,
  dateRangeLabel: DateRanges.MONTH_TO_DATE,
  recordType: 'transfer_rates',
  serviceTypes: ['http', 'https'],
  contentProviders: [],
  contentProviderGroups: [],
  contentProviderProperties: [],
  serviceProviders: [],
  serviceProviderGroups: [],
  onOffNet: ['on', 'off'],
  errorCodes: Immutable.List(),
  statusCodes: Immutable.List(),
  storageType: 'bytes',
  video: '/elephant/169ar/elephant_master.m3u8'
})

const initialState = Immutable.fromJS({
  filters: defaultFilters,
  filterOptions: {
    recordType: [{label: 'Bandwidth', value: 'transfer_rates'}, {label: 'Requests', value: 'requests'}],
    serviceTypes: [{label: 'http', value: 'http'}, {label: 'https', value: 'https'}],
    contentProviders: [],
    contentProviderGroups: [],
    contentProviderProperties: [],
    serviceProviders: [],
    serviceProviderGroups: [],
    onOffNet: [{label: 'On-Net', value: 'on'}, {label: 'Off-Net', value: 'off'}],
    errorCodes: getAnalysisErrorCodes().map((obj) => {
      return { label: obj, value: obj } 
    }),
    statusCodes: getAnalysisStatusCodes().map((obj) => {
      return { label: obj, value: obj } 
    })
  },
  fetching: false
})

// REDUCERS

export function setValue(state, action) {
  const filterName = action.payload.filterName
  const filterValue = action.payload.filterValue

  if (filterName === 'serviceProviders') {
    if (filterValue !== state.getIn(['filters', 'serviceProviders'])) {
      state = state.setIn(['filters', 'serviceProviderGroups'], Immutable.List())
      state = state.setIn(['filterOptions', 'serviceProviderGroups'], Immutable.List())
    }
  } else if (filterName === 'contentProviders') {
    if (filterValue !== state.getIn(['filters', 'contentProviders'])) {
      state = state.setIn(['filters', 'contentProviderGroups'], Immutable.List())
      state = state.setIn(['filterOptions', 'contentProviderGroups'], Immutable.List())
    }
  }

  return state.setIn(['filters', filterName], Immutable.fromJS(filterValue))
}

export function resetDefaults(state) {
  return state.merge(initialState)
}

export function resetContributionDefaults(state) {
  state = state.setIn(['filters', 'contentProviders'], Immutable.List())
  state = state.setIn(['filters', 'contentProviderGroups'], Immutable.List())
  state = state.setIn(['filters', 'contentProviderProperties'], Immutable.List())
  state = state.setIn(['filters', 'serviceProviders'], Immutable.List())
  state = state.setIn(['filters', 'serviceProviderGroups'], Immutable.List())
  state = state.setIn(['filterOptions', 'contentProviders'], Immutable.List())
  state = state.setIn(['filterOptions', 'contentProviderGroups'], Immutable.List())
  state = state.setIn(['filterOptions', 'contentProviderProperties'], Immutable.List())
  state = state.setIn(['filterOptions', 'serviceProviders'], Immutable.List())
  state = state.setIn(['filterOptions', 'serviceProviderGroups'], Immutable.List())

  return state
}

export function resetErrorCodes(state) {
  state = state.setIn(['filters', 'errorCodes'], initialState.getIn(['filters', 'errorCodes']))
  state = state.setIn(['filterOptions', 'errorCodes'], initialState.getIn(['filterOptions', 'errorCodes']))

  return state
}

export function resetStatusCodes(state) {
  state = state.setIn(['filters', 'statusCodes'], initialState.getIn(['filters', 'statusCodes']))
  state = state.setIn(['filterOptions', 'statusCodes'], initialState.getIn(['filterOptions', 'statusCodes']))

  return state
}

export function fetchServiceProvidersSuccess(state, action) {
  const data = action.payload.data
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviders: sortedData
    }),
    fetching: false
  })
}

export function fetchServiceProvidersFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviders: []
    }),
    fetching: false
  })
}

export function fetchContentProvidersSuccess(state, action) {
  const data = action.payload.data
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviders: sortedData
    }),
    fetching: false
  })
}

export function fetchContentProvidersFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviders: []
    }),
    fetching: false
  })
}

export function fetchServiceProviderGroupsSuccess(state, action) {
  const data = action.payload.data
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviderGroups: sortedData
    }),
    fetching: false
  })
}

export function fetchServiceProviderGroupsFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviderGroups: []
    }),
    fetching: false
  })
}

export function fetchContentProviderGroupsSuccess(state, action) {
  const data = action.payload.data
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviderGroups: sortedData
    }),
    fetching: false
  })
}

export function fetchContentProviderGroupsFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviderGroups: []
    }),
    fetching: false
  })
}

export function fetchSPsforCPSuccess(state, action) {
  const data = action.payload
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviders: sortedData
    }),
    fetching: false
  })
}

export function fetchSPsforCPFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviders: []
    }),
    fetching: false
  })
}

export function fetchCPsforSPSuccess(state, action) {
  const data = action.payload
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviders: sortedData
    }),
    fetching: false
  })
}

export function fetchCPsforSPFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviders: []
    }),
    fetching: false
  })
}

export function fetchSPGroupsforCPSuccess(state, action) {
  const data = action.payload
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviderGroups: sortedData
    }),
    fetching: false
  })
}

export function fetchSPGroupsforCPFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      serviceProviderGroups: []
    }),
    fetching: false
  })
}

export function fetchCPGroupsforSPSuccess(state, action) {
  const data = action.payload
  const sortedData = data.sort((lhs, rhs) => {
    return lhs.name.localeCompare(rhs.name)
  })

  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviderGroups: sortedData
    }),
    fetching: false
  })
}

export function fetchCPGroupsforSPFailure(state) {
  return state.merge({
    filterOptions: state.get('filterOptions').merge({
      contentProviderGroups: []
    }),
    fetching: false
  })
}

const SET_FILTER_VALUE = 'SET_FILTER_VALUE'
const RESET_FILTERS = 'RESET_FILTERS'
const RESET_CONTRIBUTION_FILTERS = 'RESET_CONTRIBUTION_FILTERS'
const RESET_STATUS_FILTERS = 'RESET_STATUS_FILTERS'
const RESET_ERROR_FILTERS = 'RESET_ERROR_FILTERS'
const SERVICE_PROVIDERS_FETCHED = 'SERVICE_PROVIDERS_FETCHED'
const SERVICE_PROVIDER_GROUPS_FETCHED = 'SERVICE_PROVIDER_GROUPS_FETCHED'
const SERVICE_PROVIDERS_WITH_TRAFFIC_FOR_CP_FETCHED = 'SERVICE_PROVIDERS_WITH_TRAFFIC_FOR_CP_FETCHED'
const SERVICE_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_CP_FETCHED = 'SERVICE_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_CP_FETCHED'
const CONTENT_PROVIDERS_FETCHED = 'CONTENT_PROVIDERS_FETCHED'
const CONTENT_PROVIDER_GROUPS_FETCHED = 'CONTENT_PROVIDER_GROUPS_FETCHED'
const CONTENT_PROVIDERS_WITH_TRAFFIC_FOR_SP_FETCHED = 'CONTENT_PROVIDERS_WITH_TRAFFIC_FOR_SP_FETCHED'
const CONTENT_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_SP_FETCHED = 'CONTENT_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_SP_FETCHED'

export default handleActions({
  SET_FILTER_VALUE: setValue,
  RESET_FILTERS: resetDefaults,
  RESET_CONTRIBUTION_FILTERS: resetContributionDefaults,
  RESET_ERROR_FILTERS: resetErrorCodes,
  RESET_STATUS_FILTERS: resetStatusCodes,
  SERVICE_PROVIDERS_FETCHED: mapReducers(fetchServiceProvidersSuccess, fetchServiceProvidersFailure),
  CONTENT_PROVIDERS_FETCHED: mapReducers(fetchContentProvidersSuccess, fetchContentProvidersFailure),
  SERVICE_PROVIDER_GROUPS_FETCHED: mapReducers(fetchServiceProviderGroupsSuccess, fetchServiceProviderGroupsFailure),
  CONTENT_PROVIDER_GROUPS_FETCHED: mapReducers(fetchContentProviderGroupsSuccess, fetchContentProviderGroupsFailure),
  SERVICE_PROVIDERS_WITH_TRAFFIC_FOR_CP_FETCHED: mapReducers(fetchSPsforCPSuccess, fetchSPsforCPFailure),
  CONTENT_PROVIDERS_WITH_TRAFFIC_FOR_SP_FETCHED: mapReducers(fetchCPsforSPSuccess, fetchCPsforSPFailure),
  SERVICE_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_CP_FETCHED: mapReducers(fetchSPGroupsforCPSuccess, fetchSPGroupsforCPFailure),
  CONTENT_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_SP_FETCHED: mapReducers(fetchCPGroupsforSPSuccess, fetchCPGroupsforSPFailure)
}, initialState)

// ACTIONS

export const setFilterValue = createAction(SET_FILTER_VALUE)
export const resetFilters = createAction(RESET_FILTERS)
export const resetContributionFilters = createAction(RESET_CONTRIBUTION_FILTERS)
export const resetErrorFilters = createAction(RESET_ERROR_FILTERS)
export const resetStatusFilters = createAction(RESET_STATUS_FILTERS)

export const fetchServiceProviders = createAction(SERVICE_PROVIDERS_FETCHED, (brand) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts?provider_type=${ACCOUNT_TYPE_SERVICE_PROVIDER}`)
  .then(parseResponseData);
})

export const fetchContentProviders = createAction(CONTENT_PROVIDERS_FETCHED, (brand) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts?provider_type=${ACCOUNT_TYPE_CONTENT_PROVIDER}`)
  .then(parseResponseData);
})

export const fetchServiceProviderGroups = createAction(SERVICE_PROVIDER_GROUPS_FETCHED, (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
  .then(parseResponseData);
})

export const fetchContentProviderGroups = createAction(CONTENT_PROVIDER_GROUPS_FETCHED, (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
  .then(parseResponseData);
})

export const fetchServiceProvidersWithTrafficForCP = createAction(SERVICE_PROVIDERS_WITH_TRAFFIC_FOR_CP_FETCHED, (brand, opts) => {
  return axios.get(`${analyticsBase()}/sps-with-traffic-for-cp${qsBuilder(opts)}&entity=accounts`)
    .then(action => Promise.all(action.data.data.map(
      account => axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}`)
    )))
    .then(resp => resp.map(resp => resp.data))
})

export const fetchContentProvidersWithTrafficForSP = createAction(CONTENT_PROVIDERS_WITH_TRAFFIC_FOR_SP_FETCHED, (brand, opts) => {
  return axios.get(`${analyticsBase()}/cps-with-traffic-for-sp${qsBuilder(opts)}&entity=accounts`)
  .then(action => Promise.all(action.data.data.map(
    account => axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}`)
  )))
  .then(resp => resp.map(resp => resp.data))
})

export const fetchServiceProviderGroupsWithTrafficForCP = createAction(SERVICE_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_CP_FETCHED, (brand, sp_account, opts) => {
  return axios.get(`${analyticsBase()}/sps-with-traffic-for-cp${qsBuilder(opts)}&entity=groups&sp_account=${sp_account}`)
    .then(action => Promise.all(action.data.data.map(
      group => axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${sp_account}/groups/${group}`)
    )))
    .then(resp => resp.map(resp => resp.data))
})

export const fetchContentProviderGroupsWithTrafficForSP = createAction(CONTENT_PROVIDER_GROUPS_WITH_TRAFFIC_FOR_SP_FETCHED, (brand, cp_account, opts) => {
  return axios.get(`${analyticsBase()}/cps-with-traffic-for-sp${qsBuilder(opts)}&entity=groups&account=${cp_account}`)
  .then(action => Promise.all(action.data.data.map(
    group => axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${cp_account}/groups/${group}`)
  )))
  .then(resp => resp.map(resp => resp.data))
})
