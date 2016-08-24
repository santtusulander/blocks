import axios from 'axios'
import {urlBase, parseResponseData }  from '../redux/util.js'

export const fetchAll = ( zone ) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/${zone}/rr`)
    .then(parseResponseData)
}

export const fetchDetailsByName = (zone, resource) => {
  return axios.get(`${urlBase}/VCDN/v2/brands/${zone}/rr/${resource}`)
    .then(parseResponseData)
}

//TODO:
export const create = (zone, resource) => {

}

export const update = (zone, resource) => {

}

export const remove = (zone, resource) => {

}
