import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { urlBase, parseResponseData, mapReducers } from '../util'

import * as DnsRecords from '../../api/dns-records'

export const DNS_RECORDS_CREATE_SUCCESS = 'DNS_RECORDS_CREATE_SUCCESS'
export const DNS_RECORDS_CREATE_FAILED = 'DNS_RECORDS_CREATE_FAILED'

export const DNS_RECORDS_RECEIVE_RESOURCES = 'DNS_RECORDS_RECEIVE_RESOURCES'
export const DNS_RECORDS_RECEIVE_RESOURCE = 'DNS_RECORDS_RECEIVE_RESOURCE'

export const DNS_RECORDS_UPDATE_SUCCESS = 'DNS_RECORDS_UPDATE_SUCCESS'
export const DNS_RECORDS_UPDATE_FAILED = 'DNS_RECORDS_UPDATE_FAILED'

export const DNS_RECORDS_DELETE_SUCCESS = 'DNS_RECORDS_DELETE_SUCCESS'
export const DNS_RECORDS_DELETE_FAILED = 'DNS_RECORDS_DELETE_FAILED'

//STATE
const resources = [
  {
    name: 'test resource',
    rr: [
      {
        class: 'IN',
        name: 'test.udn.com',
        ttl: 3600,
        type: 'A',
        value: '85.184.251.171'
      }
    ]
  }
]

const InitialState = Immutable.fromJS(resources)

//REDUCERS
export function receiveResourcesList(state, action) {
  return state
}

export function receiveResourceDetails(state, action){
  return state
}

export default handleActions({
  DNS_RECORDS_RECEIVE_RESOURCES: receiveResourcesList,
  DNS_RECORDS_RECEIVE_RESOURCE: receiveResourceDetails
}, InitialState)

//ACTIONS
export const fetchResourcesList = createAction(DNS_RECORDS_RECEIVE_RESOURCES, zone  => {
  return DnsRecords.fetchAll( zone )
})

export const fetchResourceDetails = createAction(DNS_RECORDS_RECEIVE_RESOURCE, (zone, resource)  => {
  return DnsRecords.fetchDetailsByName( zone, resource )
})
