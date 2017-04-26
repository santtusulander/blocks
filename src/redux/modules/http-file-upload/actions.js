import { createAction } from 'redux-actions'
import * as actionTypes from './actionTypes'

const uploadStarted = (fileName, cancelUpload) => ({[ fileName ]: { cancelUpload }})

const uploading = (fileName, progress, cancelUpload) => ({[ fileName ]: { progress, cancelUpload }})

const uploadFinished = (fileName) => fileName

const uploadFailure = (fileName, error, cancelUpload) => ({[ fileName ]: { error, cancelUpload }})

export default {
  [actionTypes.UPLOAD_FILE]: createAction(actionTypes.UPLOAD_FILE, uploadStarted),
  [actionTypes.UPLOAD_PROGRESS]: createAction(actionTypes.UPLOAD_PROGRESS, uploading),
  [actionTypes.UPLOAD_FINISHED]: createAction(actionTypes.UPLOAD_FINISHED, uploadFinished),
  [actionTypes.UPLOAD_FAILURE]: createAction(actionTypes.UPLOAD_FAILURE, uploadFailure)
}

