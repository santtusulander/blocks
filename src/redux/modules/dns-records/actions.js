import {fromJS} from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { mapReducers } from '../../util'

export const DNS_RECORDS_CREATED = 'DNS_RECORDS_CREATED'
export const DNS_RECORDS_RECEIVE_RESOURCES = 'DNS_RECORDS_RECEIVE_RESOURCES'
export const DNS_RECORDS_RECEIVE_RESOURCE = 'DNS_RECORDS_RECEIVE_RESOURCE'
export const DNS_RECORDS_UPDATED = 'DNS_RECORDS_UPDATED'
export const DNS_RECORDS_DELETED = 'DNS_RECORDS_DELETED'

import * as dnsRecordsApi from './api'
import * as dnsRecordsReducers from './reducers'

//ACTIONS
export const fetchResourcesList = createAction(DNS_RECORDS_RECEIVE_RESOURCES, (zone)  => {
  return dnsRecordsApi.fetchAll( zone )
})

export const fetchResourceDetails = createAction(DNS_RECORDS_RECEIVE_RESOURCE, (zone, resource)  => {
  return dnsRecordsApi.fetchDetailsByName( zone, resource )
})

export const createResource = createAction(DNS_RECORDS_CREATED, (zone, resource, data) => {
  return dnsRecordsApi.create( zone, resource, data)
})

export const updateResource = createAction(DNS_RECORDS_UPDATED, (zone, resource, data) => {
  return dnsRecordsApi.update( zone, resource, data)
})

export const removeResource = createAction(DNS_RECORDS_DELETED, (zone, resource) => {
  return dnsRecordsApi.remove( zone, resource)
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
  DNS_RECORDS_CREATED: mapReducers(dnsRecordsReducers.createSuccess, dnsRecordsReducers.createFailed),
  DNS_RECORDS_RECEIVE_RESOURCES: mapReducers(dnsRecordsReducers.receiveResourcesList, dnsRecordsReducers.resourcesListFailed),
  DNS_RECORDS_RECEIVE_RESOURCE: mapReducers(dnsRecordsReducers.receiveResourceDetails, dnsRecordsReducers.resourceDetailsFailed),
  DNS_RECORDS_UPDATED: mapReducers(dnsRecordsReducers.updateSuccess, dnsRecordsReducers.updateFailed),
  DNS_RECORDS_DELETED: mapReducers(dnsRecordsReducers.deleteSuccess, dnsRecordsReducers.deleteFailed)
}, InitialState)
