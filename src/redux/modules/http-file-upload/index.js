import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import * as actionTypes from './actionTypes'

export default handleActions({
  [actionTypes.UPLOAD_FILE]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.UPLOAD_FINISHED]: (state, { payload }) => state.delete(payload.name)
}, Map())
