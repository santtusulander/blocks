import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import { urlBase, mapReducers, parseResponseData } from '../util'
import { ACCOUNT_TYPE_SERVICE_PROVIDER } from '../../constants/account-management-options'

export const httpErrorCodes = ['400', '401', '402', '403', '404', '405', '411', '412', '413', '500', '501', '502', '503']
export const httpOKCodes = ['200', '201', '202', '204']
export const httpStatusCodes = httpOKCodes.concat(httpErrorCodes)

const initialState = Immutable.fromJS({
  filters: {
    dateRange: {
      startDate: null,
      endDate: null
    },
    includeComparison: false,
    dateRangeLabel: 'Month to date',
    recordType: 'transfer_rates',
    serviceTypes: ['http', 'https'],
    contentProviders: [],
    contentProviderGroups: [],
    contentProviderProperties: [],
    serviceProviders: [],
    serviceProviderGroups: [],
    onOffNet: ['on-net', 'off-net'],
    errorCodes: httpErrorCodes,
    statusCodes: httpStatusCodes,
    video: '/elephant/169ar/elephant_master.m3u8'
  },
  filterOptions: {
    recordType: [{label: 'Bandwidth', value: 'transfer_rates'}, {label: 'Requests', value: 'requests'}],
    serviceTypes: [{label: 'http', value: 'http'}, {label: 'https', value: 'https'}],
    contentProviders: [],
    contentProviderGroups: [],
    contentProviderProperties: [],
    serviceProviders: [],
    serviceProviderGroups: [],
    onOffNet: [{label: 'On-Net', value: 'on-net'}, {label: 'Off-Net', value: 'off-net'}],
    errorCodes: httpErrorCodes.map((obj) => { return { label: obj, value: obj } } ),
    statusCodes: httpStatusCodes.map((obj) => { return { label: obj, value: obj } } )
  },
  fetching: false
})

// REDUCERS

export function setValue(state, action) {
  const filterName = action.payload.filterName
  const filterValue = action.payload.filterValue

  return state.setIn(['filters', filterName], Immutable.fromJS(filterValue) )
}

export function resetDefaults() {
  return initialState
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

const SET_FILTER_VALUE = 'SET_FILTER_VALUE'
const RESET_FILTERS = 'RESET_FILTERS'
const SERVICE_PROVIDERS_FETCHED = 'SERVICE_PROVIDERS_FETCHED'

export default handleActions({
  SET_FILTER_VALUE: setValue,
  RESET_FILTERS: resetDefaults,
  SERVICE_PROVIDERS_FETCHED: mapReducers(fetchServiceProvidersSuccess, fetchServiceProvidersFailure)
}, initialState)

// ACTIONS

export const setFilterValue = createAction(SET_FILTER_VALUE)
export const resetFilters = createAction(RESET_FILTERS)

export const fetchServiceProviders = createAction(SERVICE_PROVIDERS_FETCHED, (brand) => {
  return axios.get(`${urlBase}/v2/brands/${brand}/accounts?provider_type=${ACCOUNT_TYPE_SERVICE_PROVIDER}`)
  .then(parseResponseData);
})
