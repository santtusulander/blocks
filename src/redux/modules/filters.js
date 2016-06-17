import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

const SET_FILTER_VALUE = 'SET_FILTER_VALUE'

const initialState = Immutable.fromJS({
  filters: {}
})

// REDUCERS

export function setValue(state, action) {
  const filterName = action.payload.filterName
  const filterValue = action.payload.filterValue

  /*let filters = state.filters;
  filters[filterName] = filterValue
*/
  return state.setIn(['filters', filterName], filterValue)
}

export default handleActions({
  SET_FILTER_VALUE: setValue
}, initialState)

// ACTIONS

export const setFilterValue = createAction(SET_FILTER_VALUE)

