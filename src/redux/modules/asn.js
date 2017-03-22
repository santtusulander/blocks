import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { BASE_URL_NORTH } from '../util'
import { ASN_ITEMS_COUNT_TO_SEARCH } from '../../constants/network'

const ASNS_FETCHED = 'ASNS_FETCHED'

export const initialState = fromJS({})

export default handleActions({
  ASNS_FETCHED: initialState
}, initialState)

// ACTIONS
export const fetchAsns = createAction(ASNS_FETCHED, ({filterBy, filterValue}) => {
  return axios.get(`${BASE_URL_NORTH}/asns?filter_by=${filterBy}&filter_value=${filterValue}&page_size=${ASN_ITEMS_COUNT_TO_SEARCH}`)
  .then((res) => {
    if(res) {
      return res.data.data;
    }
  });
})
