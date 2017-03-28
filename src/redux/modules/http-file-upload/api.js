import axios from 'axios'
import fileUploadAdapter from './uploader/file-upload-adapter'
import * as actionTypes from './actionTypes'

const UPLOAD_VERSION = 'v1'
const UPLOAD_PROTOCOL = 'https://'
const UPLOAD_PORT = ':8080'

/**
 * Upload file via POST request to API
 * @param accessKey {string} - upload access key
 * @param gateway {string} - gateway host
 * @param {object} file - {key - file name, value - file binary data}
 * @param uploadHandlers {object} - action creators map
 * @returns {axios.Promise}
 */
export const uploadFile = (accessKey, gateway, file, uploadHandlers) => {
  const [ fileName ] = Object.keys(file)
  const [ data ] = Object.values(file)
  const url = `${UPLOAD_PROTOCOL}/${gateway}${UPLOAD_PORT}/${UPLOAD_VERSION}/${fileName}`

  const headers = { 'X-Auth-Token': accessKey }
  const adapter = fileUploadAdapter

  const config = { headers, adapter, uploadHandlers, fileName }

  return axios.post(url, data, config)
    .then(response => {
      const { fileName } = response.config
      if (fileName) uploadHandlers[actionTypes.UPLOAD_FINISHED](fileName)
    })
    .catch(fileName => {
      if (typeof fileName === 'string') uploadHandlers[actionTypes.UPLOAD_FAILURE](fileName)
    })
}
