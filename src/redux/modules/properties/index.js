import {combineReducers} from 'redux'

import properties from './actions'
import * as actionTypes from './actionTypes'
import {createFetchingReducers} from '../fetching/actions'

export default combineReducers({
  properties,
  fetching: createFetchingReducers( actionTypes, 'properties')
})
