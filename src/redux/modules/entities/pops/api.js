import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA }  from '../../../util.js'

const footprint = new schema.Entity('footprint')

const pod = new schema.Entity('pods', {
  footprints: [ footprint ]
}, {
  idAttribute: `cloud-location-id`
})


const pop = new schema.Entity('pops', {
  pods: [ pod ]
})


/**
 * Fetch single pop
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account, group, network, popId) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops/${popId}`)
    .then( ({data}) => {
      return normalize(data, pop)
    })
}

/**
 * Fetch list of POPs
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand, account, group, network) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops`)
}
