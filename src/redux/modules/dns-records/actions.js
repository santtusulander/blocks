import * as DnsRecordsApi from './api'
import * as reducer from './reducers'

import { createAction, handleActions } from 'redux-actions'
import { mapReducers } from '../../util'

export const DNS_RECORDS_CREATED = 'DNS_RECORDS_CREATED'
export const DNS_RECORDS_RECEIVE_RESOURCES = 'DNS_RECORDS_RECEIVE_RESOURCES'
export const DNS_RECORDS_RECEIVE_RESOURCE = 'DNS_RECORDS_RECEIVE_RESOURCE'
export const DNS_RECORDS_UPDATED = 'DNS_RECORDS_UPDATED'
export const DNS_RECORDS_DELETED = 'DNS_RECORDS_DELETED'

//ACTIONS
export const fetchResourcesList = createAction(DNS_RECORDS_RECEIVE_RESOURCES, (zone)  => {
  return DnsRecordsApi.fetchAll( zone )
})

export const fetchResourceDetails = createAction(DNS_RECORDS_RECEIVE_RESOURCE, (zone, resource)  => {
  return DnsRecordsApi.fetchDetailsByName( zone, resource )
})

export const createResource = createAction(DNS_RECORDS_CREATED, (zone, resource, data) => {
  return DnsRecordsApi.create( zone, resource, data)
})

export const updateResource = createAction(DNS_RECORDS_UPDATED, (zone, resource, data) => {
  return DnsRecordsApi.update( zone, resource, data)
})

export const removeResource = createAction(DNS_RECORDS_DELETED, (zone, resource) => {
  return DnsRecordsApi.remove( zone, resource)
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
  DNS_RECORDS_CREATED: mapReducers(reducer.createSucess, reducer.createFailed),
  DNS_RECORDS_RECEIVE_RESOURCES: mapReducers(reducer.receiveResourcesList, reducer.failedResourcesList),
  DNS_RECORDS_RECEIVE_RESOURCE: mapReducers(reducer.receiveResourceDetails, reducer.failedResourceDetails),
  DNS_RECORDS_UPDATED: mapReducers(reducer.updateSucess, reducer.updateFailed),
  DNS_RECORDS_DELETED: mapReducers(reducer.deleteSucess, reducer.deleteFailed)
}, InitialState)
