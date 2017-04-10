import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { BASE_URL_NORTH }  from '../../../util.js'

const gtmSchema = new schema.Entity('gtm', {}, { idAttribute: (gtm, { property }) => property })
const propertyGTM = new schema.Entity('wrapper', { gtm: gtmSchema })

const URL = (brand, account, group, property, service) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/services/${service}/gtm`

export const fetch = ({ brand, account, group, property, service }) =>
  axios.get(URL(brand, account, group, property, service))
    .then(({ data }) => {
      return normalize({ property, gtm: data }, propertyGTM)
    })

export const create = ({ brand, account, group, property, service, payload }) =>
  axios.post(URL(brand, account, group, property, service), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ property, gtm: data }, propertyGTM)
    })

export const update = ({ brand, account, group, property, service, payload }) =>
  axios.put(URL(brand, account, group, property, service), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ property, gtm: data }, propertyGTM)
    })

export const remove = ({ brand, account, group, property, service }) =>
  axios.delete(URL(brand, account, group, property, service))
    .then(() => ({ id: property }))
