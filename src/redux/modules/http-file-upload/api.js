import axios from 'axios'
import { parseResponseData } from '../../util'

const UPLOAD_URL = '/v1'
const UPLOAD_PROTOCOL = 'http://'
const UPLOAD_PORT = ':8080'

/**
 * Upload file via POST request to API
 * @param accessKey {string} - upload access key
 * @param gateway {string} - gateway host
 * @param {object} file - {key - file name, value - file binary data}
 * @param onProgress {callback} - function for tracking 'progress' event
 * @returns {axios.Promise}
 */
export const uploadFile = (accessKey, gateway, file, onProgress =()=>{}) => {
  const [ name ] = Object.keys(file)
  const [ data ] = Object.values(file)
  const url = `${UPLOAD_PROTOCOL}${gateway}${UPLOAD_PORT}${UPLOAD_URL}/${name}`
  const headers = {
    // 'Content-Type': 'multipart/form-data',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Auth-Token': accessKey
  }
  debugger
  return axios.post(url, gateway, { data }, { headers, progress: onProgress })
    .then(parseResponseData)
}
