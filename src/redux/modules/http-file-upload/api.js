import axios from 'axios'
import { parseResponseData } from '../../util'
import { BASE_URL_CIS_UPLOAD } from '../../../redux/util'

/**
 * @function uploadFile
 * @param {object} file - {key - file name, value - file binary data}
 * @returns {axios.Promise}
 */
export const uploadFile = (accessKey, file, onProgress =()=>{}) => {
  const [ name ] = Object.keys(file)
  const [ data ] = Object.values(file)
  const url = `${BASE_URL_CIS_UPLOAD}/${name}`
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Auth-Token': accessKey
  }
  return axios.post(url, { data }, { headers, progress: onProgress })
    .then(parseResponseData)
}
