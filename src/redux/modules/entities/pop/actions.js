import * as api from './api'
import {actionTypes} from '../index'

export const fetch = (brand, account, group, network, popId ) => {
  return {
    types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
    shouldCallApi: true,
    callApi: () => { return api.fetch(brand, account, group, network, popId) }
  }
}

export const fetchAll = (brand, account, group, network ) => {
  return {
    types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
    shouldCallApi: true,
    callApi: () => { return api.fetchAll(brand, account, group, network) }
  }
}
