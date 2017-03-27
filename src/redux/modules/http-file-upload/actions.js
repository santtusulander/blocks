import { createAction } from 'redux-actions'
import * as actionTypes from './actionTypes'

const uploadStarted = (fileName, xhr) => ({[ fileName ]: { xhr }})

const uploading = (fileName, xhr, progress) => ({[ fileName ]: { xhr, progress }})

const uploadFinished = (fileName) => fileName

const uploadFailure = (fileName) => ({[ fileName ]: { error: true }})

export default {
  [actionTypes.UPLOAD_FILE]: createAction(actionTypes.UPLOAD_FILE, uploadStarted),
  [actionTypes.UPLOAD_PROGRESS]: createAction(actionTypes.UPLOAD_PROGRESS, uploading),
  [actionTypes.UPLOAD_FINISHED]: createAction(actionTypes.UPLOAD_FINISHED, uploadFinished),
  [actionTypes.UPLOAD_FAILURE]: createAction(actionTypes.UPLOAD_FAILURE, uploadFailure)
}

