import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import * as actionTypes from './actionTypes'

const initialState = Map()

export default handleActions({
  [actionTypes.UPLOAD_PROGRESS]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.UPLOAD_FILE]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.UPLOAD_FINISHED]: (state, { payload }) => state.delete(payload),
  [actionTypes.UPLOAD_FAILURE]: (state, { payload }) => state.merge(fromJS(payload)),
  [actionTypes.CANCEL_UPLOAD]: (state, { payload }) => state.delete(payload)
}, initialState)
