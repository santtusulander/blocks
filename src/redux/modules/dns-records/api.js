import axios from 'axios'
import { BASE_URL_NORTH, PAGINATION_MOCK }  from '../../util.js'

/* CRUD OPERATIONS FOR DNS Resource Records */

export const fetchAll = (zone) => {
  return axios.get(`${BASE_URL_NORTH}/brands/udn/zones/${zone}/rr?format=detailed`, PAGINATION_MOCK)
    .then(({data})  => ({ data, zone }))
}

export const fetchDetailsByName = (zone, resource) => {
  return axios.get(`${BASE_URL_NORTH}/brands/udn/zones/${zone}/rr/${resource}`)
    .then(({data})  => ({ data, zone, resource }))
}

export const create = (zone, resource, data) => {
  return axios.post(`${BASE_URL_NORTH}/brands/udn/zones/${zone}/rr/${resource}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const update = (zone, resource, data) => {
  return axios.put(`${BASE_URL_NORTH}/brands/udn/zones/${zone}/rr/${resource}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const remove = (zone, resource, data) => {
  return axios({
    url: `${BASE_URL_NORTH}/brands/udn/zones/${zone}/rr/${resource}`,
    method: 'delete',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => data.id)
}
