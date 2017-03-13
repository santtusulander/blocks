import axios from 'axios'

import { parseResponseData } from '../../util'
import { getUserToken } from '../../../util/local-storage'

import { BASE_URL_AAA, BASE_URL_CIS_NORTH, BASE_URL_CIS_UPLOAD } from '../../../redux/util'

const HEADERS = {headers: {'Content-Type': 'application/json'}}
const getAuthHeaderToken = (token) => ({'X-Auth-Token': token})

const _MOCK_ = {
  id: 'testingest',
  getUserToken: () => axios.post(`${BASE_URL_AAA}/tokens`, {username: "cis-user@cis.com", password: "cis"}, HEADERS )
    .then(parseResponseData)
    .then(getAuthHeaderToken)
}

/**
 * Fetch access key used for file upload
 * @param id {string} - ingest point id
 * @returns {axios.Promise|Promise}
 */
export const getAccessKeyById = (id = _MOCK_.id) => {
  if ([...arguments].includes(undefined)) return Promise.reject(null)

  const url = `${BASE_URL_CIS_NORTH}/ingest_points/${id}/access_keys`

  return _MOCK_ ?
    _MOCK_.getUserToken().then(token => axios.post(url, null, {headers: {...HEADERS, ...token}})).then(parseResponseData) :
    axios.post(url, null, {headers: {...HEADERS, ...getAuthHeaderToken(getUserToken())}}).then(parseResponseData)
}


/**
 * Return file upload handler if token provided
 * @param accessKey {string} - upload access key
 * @param progress {function} - progress event handler
 * @return {uploadFile|undefined}
 */
export const initFileUploader = (accessKey, progress) => ([...arguments].includes(undefined)) ?
  undefined :
  /**
   * @function uploadFile
   * @param {object} file - {key - file name, value - file binary data}
   * @returns {axios.Promise}
   */
  (file) => {
    const [ name ] = Object.keys(file)
    const [ data ] = Object.values(file)
    const url = `${BASE_URL_CIS_UPLOAD}/${name}`
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Token': accessKey
    }
    return axios.post(url, { data }, { headers, progress }).then(parseResponseData)
  }

/**
 * Read file content in binary format.
 * @param file {File} - File object
 * @returns {Promise}
 */
export const readFile = (file) => {
  return new Promise(resolve => {
    const event = 'load'
    const reader = new FileReader()

    const listener = () => {
      resolve({ [ file.name ]: reader.result })
      reader.removeEventListener(event, listener)
    }

    reader.addEventListener(event, listener)
    reader.readAsBinaryString(file)
  })
}
