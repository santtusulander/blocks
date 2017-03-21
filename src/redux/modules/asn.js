import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { mapReducers, BASE_URL_CIS_NORTH } from '../util'

const ASNS_FETCHED = 'ASNS_FETCHED'

export const initialState = fromJS({})

// REDUCERS
export function asnsFetchSuccess() {
  return fromJS({})
}

export function asnsFetchFailure() {
  return fromJS({})
}

export default handleActions({
  ASNS_FETCHED: mapReducers(asnsFetchSuccess, asnsFetchFailure)
}, initialState)

// ACTIONS
export const fetchAsns = createAction(ASNS_FETCHED, ({filterBy, filterValue}) => {
  return axios.get(`${BASE_URL_CIS_NORTH}/asns?filter_by=${filterBy}&filter_value=${filterValue}`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})
