import * as api from './api'
import {actionTypes} from '../index'

export const fetch = (brand, account, group, network, popId ) => {
  return {
    types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
    callApi: () => { return api.fetch(brand, account, group, network, popId) }
  }
}

export const fetchAll = (dispatch) => ( brand, account, group, network ) => {
  return api.fetchAll(brand, account, group, network)
    .then( ({data}) => {
      data.forEach( popId => {
        dispatch ( fetch( brand, account, group, network, popId) )
      })
    })
}
