import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  filters: {
    dateRange: {
      startDate: null,
      endDate: null
    }, //startDate: , endDate: },
    dateRangeLabel: '',
    serviceTypes: ['http', 'https'],
    serviceProviders: ['All'],
    onOffNet: ['on-net', 'off-net'],
    statusCodes: ['All'],
    video: '/elephant/169ar/elephant_master.m3u8'
  },
  filterOptions: {
    serviceTypes: [{label: 'http', value: 'http'}, {label: 'https', value: 'https'}],
    serviceProviders: [{label: 'All', value: 'all'} ],
    onOffNet: [{label: 'On-Net', value: 'on-net'}, {label: 'Off-Net', value: 'off-net'}],
    statusCodes: [{label: 'All', value: 'All'}, {label: '500', value: '500'}, {label: '404', value: '404'}]
  }
})

// REDUCERS

export function setValue(state, action) {
  const filterName = action.payload.filterName
  const filterValue = action.payload.filterValue

  return state.setIn(['filters', filterName], Immutable.fromJS(filterValue) )
}

export function resetDefaults(state, action){
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
