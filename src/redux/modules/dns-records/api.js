import axios from 'axios'
import {urlBase }  from '../../util.js'

/* CRUD OPERATIONS FOR DNS Resource Records */

export const fetchAll = ( zone ) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/udn/zones/${zone}/rr?format=detailed`)
    .then( ({data})  => ({ data, zone }))
}

export const fetchDetailsByName = (zone, resource) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/udn/zones/${zone}/rr/${resource}`)
    .then( ({data})  => ({ data, zone, resource }))
}

export const create = (zone, resource, data) => {
  return axios.post(`${urlBase}/VCDN/v2/brands/udn/zones/${zone}/rr/${resource}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const update = (zone, resource, data) => {
  return axios.put(`${urlBase}/VCDN/v2/brands/udn/zones/${zone}/rr/${resource}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(({ data }) => ({ data, zone, resource }))
}

export const remove = (zone, resource, data) => {
  return axios({
    url: `${urlBase}/VCDN/v2/brands/udn/zones/${zone}/rr/${resource}`,
    method: 'delete',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => data.id)
}


