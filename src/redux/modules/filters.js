import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  filters: {
    dateRange: {}, //startDate: , endDate: },
    dateRangeLabel: '',
    serviceTypes: ['http', 'https'],
    serviceProviders: ['All'],
    onOffNet: ['on-net', 'off-net'],
    errorCodes: ['All']
  },
  filterOptions: {
    serviceTypes: [{label: 'http', value: 'http'}, {label: 'https', value: 'https'}],
    serviceProviders: [{label: 'All', value: 'all'} ],
    onOffNet: [{label: 'On-Net', value: 'on-net'}, {label: 'Off-Net', value: 'off-net'}],
    errorCodes: [],
  }
})

// REDUCERS

export function setValue(state, action) {
  const filterName = action.payload.filterName
  const filterValue = action.payload.filterValue

  return state.setIn(['filters', filterName], Immutable.fromJS(filterValue) )
}

const SET_FILTER_VALUE = 'SET_FILTER_VALUE'

export default handleActions({
  SET_FILTER_VALUE: setValue
}, initialState)

// ACTIONS

export const setFilterValue = createAction(SET_FILTER_VALUE)

