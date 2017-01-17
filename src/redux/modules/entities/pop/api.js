import axios from 'axios'
import {normalize} from 'normalizr'

import { BASE_URL_AAA }  from '../../../util.js'
import {Schemas} from '../schemas'

/**
 * Fetch single pop
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account, group, network, iata) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}/network/${network}/pops/${iata}`)
    .then( ({data}) => {

      return normalize(data, Schemas.pop)
    })
}

/**
 * Fetch list of POPs
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand, account, group, network) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}/network/${network}/pops`)
    .then( ({data}) => {

      return normalize(data.data, Schemas.pops)
    })
}
