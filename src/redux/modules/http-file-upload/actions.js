import { createAction } from 'redux-actions'
import { bindActionCreators } from 'redux'
import * as api from './api'
import { UPLOAD_FILE } from './actionTypes'


const actionCreators = {
  [UPLOAD_FILE]: createAction(UPLOAD_FILE, (accessKey, onProgress, file) => api.uploadFile(...arguments))
}

export default (dispatch) => bindActionCreators(actionCreators, dispatch)


