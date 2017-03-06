import axios from 'axios'
import {/*arrayOf,*/ normalize, schema} from 'normalizr'

import { BASE_URL_AAA }  from '../../util.js'

//import {Schemas} from '../schemas'

const service = new schema.Entity('services')
const providerType = new schema.Entity('provider_types')
const regions = new schema.Entity('regions', {}, { idAttribute: 'region_code' })

const Schemas = {
  serviceInfo: {
    services: new schema.Array(service),
    provider_types: new schema.Array(providerType),
    regions: new schema.Array(regions)
  }
}

/**
 * Fetch UDN Service Info
   * @return {} normalized data structure
 */

export const fetchAll = () => {
  return axios.get(`${BASE_URL_AAA}/service_info`)
    .then( ({data}) => {
      return normalize(data, Schemas.serviceInfo)
    })
}
