import axios from 'axios'
import {arrayOf, normalize, Schema} from 'normalizr'

import { BASE_URL_AAA }  from '../../util.js'

//import {Schemas} from '../schemas'

const service = new Schema('services')
const providerType = new Schema('provider_types')

const Schemas = {
  serviceInfo: {
    services: arrayOf(service),
    provider_types: arrayOf(providerType)
  }
}

/**
 * Fetch UDN Service Info
   * @return {} normalized data structure
 */

export const fetchAll = () => {
  return axios.get(`${BASE_URL_AAA}/service_info`)
    .then( ({data}) => {
      const normalizedData = normalize(data, Schemas.serviceInfo)
      return normalizedData
    })
}
