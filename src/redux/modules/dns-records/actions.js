import * as DnsRecordsApi from './api'
import * as reducer from './reducers'

import { createAction, handleActions } from 'redux-actions'
import { mapReducers } from '../../util'

export const DNS_RECORDS_CREATE_SUCCESS = 'DNS_RECORDS_CREATE_SUCCESS'
export const DNS_RECORDS_CREATE_FAILED = 'DNS_RECORDS_CREATE_FAILED'

export const DNS_RECORDS_RECEIVE_RESOURCES = 'DNS_RECORDS_RECEIVE_RESOURCES'
export const DNS_RECORDS_RECEIVE_RESOURCE = 'DNS_RECORDS_RECEIVE_RESOURCE'

export const DNS_RECORDS_UPDATE_SUCCESS = 'DNS_RECORDS_UPDATE_SUCCESS'
export const DNS_RECORDS_UPDATE_FAILED = 'DNS_RECORDS_UPDATE_FAILED'

export const DNS_RECORDS_DELETE_SUCCESS = 'DNS_RECORDS_DELETE_SUCCESS'
export const DNS_RECORDS_DELETE_FAILED = 'DNS_RECORDS_DELETE_FAILED'

//ACTIONS
export const fetchResourcesList = createAction(DNS_RECORDS_RECEIVE_RESOURCES, (zone)  => {
  return DnsRecordsApi.fetchAll( zone )
})

export const fetchResourceDetails = createAction(DNS_RECORDS_RECEIVE_RESOURCE, (zone, resource)  => {
  return DnsRecordsApi.fetchDetailsByName( zone, resource )
})


//RESOURCE MODEL
/*const resources = [
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
 */

const InitialState = fromJS({
  loading: false,
  resources: []
})

export default handleActions({
  DNS_RECORDS_RECEIVE_RESOURCES: mapReducers(reducer.receiveResourcesList, reducer.failedResourcesList),
  DNS_RECORDS_RECEIVE_RESOURCE: mapReducers(reducer.receiveResourceDetails, reducer.failedResourceDetails)
}, InitialState)
