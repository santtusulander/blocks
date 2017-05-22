import axios, { CancelToken, isCancel } from 'axios'
import * as actionTypes from './actionTypes'

const UPLOAD_VERSION = 'v1'
const UPLOAD_PROTOCOL = 'https://'
const UPLOAD_PORT = ':443'

/**
 * Upload file via POST request to API
 * @param accessKey {string} - upload access key
 * @param gateway {string} - gateway host
 * @param {object} file - {key - file name, value - file binary data}
 * @param uploadHandlers {object} - action creators map
 * @returns {*|Promise.<T>}
 */
export const uploadFile = (accessKey, gateway, file, uploadHandlers, uploadPath) => {
  const [ fileName ] = Object.keys(file)
  const [ data ] = Object.values(file)
  const url = `${UPLOAD_PROTOCOL}/${gateway}${UPLOAD_PORT}/${UPLOAD_VERSION}/${uploadPath}${fileName}`
  const headers = { 'X-Auth-Token': accessKey }
  const { cancel, token: cancelToken } = CancelToken.source()

  /**
   * Abort uploading
   */
  const cancelUpload = () => {
    uploadHandlers[actionTypes.UPLOAD_FINISHED](fileName)
    cancel()
  }

  /**
   * Start uploading
   */
  const startUpload = () => {
    uploadHandlers[actionTypes.UPLOAD_FILE](fileName, cancelUpload)
  }

  /**
   * Update uploading progress
   * @param {Event} e - upload event
   */
  const onUploadProgress = (e) => {
    const { lengthComputable, loaded, total } = e
    const progress = lengthComputable ? parseInt(loaded / total * 100) : 0

    uploadHandlers[actionTypes.UPLOAD_PROGRESS](fileName, progress, cancelUpload)
  }

  /**
   * File uploaded
   * @param {axios.response} response - response
   * @return {*}
   */
  const uploadFinished = (response) => {
    uploadHandlers[actionTypes.UPLOAD_FINISHED](fileName)

    return response
  }

  /**
   * File upload failure
   * @param {Error} error - error response
   * @return {*}
   */
  const uploadFailed = (error) => {
    const cancelled = isCancel(error)

    if (cancelled) {
      uploadHandlers[actionTypes.UPLOAD_FINISHED](fileName)
    } else {
      uploadHandlers[actionTypes.UPLOAD_FAILURE](fileName, !cancelled, cancelUpload)
    }

    return error
  }

  // init
  startUpload()

  return axios.post(url, data, { headers, cancelToken, fileName, onUploadProgress })
    .then(uploadFinished)
    .catch(uploadFailed)
}
