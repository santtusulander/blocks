import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

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
    serviceProviders: ['All'],
    onOffNet: ['on-net', 'off-net'],
    statusCodes: ['400', '401', '402', '403', '404', '405', '411', '412', '413', '500', '501', '502', '503'],
    video: '/elephant/169ar/elephant_master.m3u8'
  },
  filterOptions: {
    recordType: [{label: 'Bandwidth', value: 'transfer_rates'}, {label: 'Requests', value: 'requests'}],
    serviceTypes: [{label: 'http', value: 'http'}, {label: 'https', value: 'https'}],
    serviceProviders: [{label: 'All', value: 'all'} ],
    onOffNet: [{label: 'On-Net', value: 'on-net'}, {label: 'Off-Net', value: 'off-net'}],
    statusCodes: [
      {label: '400', value: '400'},
      {label: '401', value: '401'},
      {label: '402', value: '402'},
      {label: '403', value: '403'},
      {label: '404', value: '404'},
      {label: '405', value: '405'},
      {label: '411', value: '411'},
      {label: '412', value: '412'},
      {label: '413', value: '413'},
      {label: '500', value: '500'},
      {label: '501', value: '501'},
      {label: '502', value: '502'},
      {label: '503', value: '503'}
    ]
  }
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

const SET_FILTER_VALUE = 'SET_FILTER_VALUE'
const RESET_FILTERS = 'RESET_FILTERS'

export default handleActions({
  SET_FILTER_VALUE: setValue,
  RESET_FILTERS: resetDefaults
}, initialState)

// ACTIONS

export const setFilterValue = createAction(SET_FILTER_VALUE)
export const resetFilters = createAction(RESET_FILTERS)
