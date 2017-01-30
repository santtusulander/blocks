import {combineReducers} from 'redux'

import properties from './actions'
import * as actionTypes from './actionTypes'
import mapActionsToFetchingReducers from '../fetching/actions'

export default combineReducers({
  properties,
  fetching: mapActionsToFetchingReducers( actionTypes )
})
