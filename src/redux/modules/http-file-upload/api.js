import axios from 'axios'
import { parseResponseData } from '../../util'

const UPLOAD_VERSION = 'v1'
const UPLOAD_PROTOCOL = 'http://'
const UPLOAD_PORT = ':8080'

/**
 * Upload file via POST request to API
 * @param accessKey {string} - upload access key
 * @param gateway {string} - gateway host
 * @param {object} file - {key - file name, value - file binary data}
 * @param progress {callback} - function for tracking 'progress' event
 * @returns {axios.Promise}
 */
export const uploadFile = (accessKey, gateway, file, onProgress) => {
  const [ fileName ] = Object.keys(file)
  const [ data ] = Object.values(file)

  const url = `${UPLOAD_PROTOCOL}/${gateway}${UPLOAD_PORT}/${UPLOAD_VERSION}/${fileName}`

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Auth-Token': accessKey
  }

  const progress = onProgress(fileName)

  return axios.post(url, data, { headers, progress })
    .then(parseResponseData)
}
