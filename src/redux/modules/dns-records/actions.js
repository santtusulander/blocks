import _ from 'underscore'
import uniqid from 'uniqid'
import {fromJS} from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { mapReducers } from '../../util'

export const DNS_RECORDS_CREATED = 'DNS_RECORDS_CREATED'
export const DNS_RECORDS_RECEIVE_RESOURCES = 'DNS_RECORDS_RECEIVE_RESOURCES'
export const DNS_RECORDS_RECEIVE_RESOURCE = 'DNS_RECORDS_RECEIVE_RESOURCE'
export const DNS_RECORDS_UPDATED = 'DNS_RECORDS_UPDATED'
export const DNS_RECORDS_DELETED = 'DNS_RECORDS_DELETED'

export const DNS_RECORD_RECEIVE_WITH_DETAILS = 'DNS_RECORD_RECEIVE_WITH_DETAILS'
export const DNS_RECORDS_START_FETCHING = 'DNS_RECORDS_START_FETCHING'
export const DNS_RECORDS_STOP_FETCHING = 'DNS_RECORDS_STOP_FETCHING'
export const DNS_RECORDS_SET_ACTIVE = 'DNS_RECORDS_SET_ACTIVE'

import * as dnsRecordsApi from './api'
import * as dnsRecordsReducers from './reducers'

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
  activeRecord: null,
  loading: false,
  resources: []
})

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

export const fetchResourcesWithDetails = createAction(DNS_RECORD_RECEIVE_WITH_DETAILS, (zone) => {
  return dnsRecordsApi.fetchAll( zone )
    .then(({data}) => {
      return Promise.all( data.map( resource => {
        return dnsRecordsApi.fetchDetailsByName(zone, resource)
          .then( ({data}) => {
            return data
          })
      })).then( data => {
        //Flatten records to single array and add uniq Ids
        return _.flatten(data).map( record => {
          record.id = uniqid()
          return record
        })
      })
    })
})

export const startFetching = createAction(DNS_RECORDS_START_FETCHING)
export const stopFetching = createAction(DNS_RECORDS_STOP_FETCHING)
export const setActiveRecord = createAction(DNS_RECORDS_SET_ACTIVE)

export default handleActions({
  DNS_RECORDS_CREATED: mapReducers(dnsRecordsReducers.createSuccess, dnsRecordsReducers.createFailed),
  DNS_RECORDS_UPDATED: mapReducers(dnsRecordsReducers.updateSuccess, dnsRecordsReducers.updateFailed),
  DNS_RECORDS_DELETED: mapReducers(dnsRecordsReducers.deleteSuccess, dnsRecordsReducers.deleteFailed),
  DNS_RECORD_RECEIVE_WITH_DETAILS: mapReducers(dnsRecordsReducers.receiveWithDetails, dnsRecordsReducers.receiveWithDetailsFailed),

  DNS_RECORDS_START_FETCHING: dnsRecordsReducers.startedFetching,
  DNS_RECORDS_STOP_FETCHING: dnsRecordsReducers.stoppedFetching,
  DNS_RECORDS_SET_ACTIVE: dnsRecordsReducers.setActive

  // These are not needed at the moment as list and details are fetched using single request (fetchResourcesWithDetails)
  //DNS_RECORDS_RECEIVE_RESOURCES: mapReducers(dnsRecordsReducers.receiveResourcesList, dnsRecordsReducers.resourcesListFailed),
  //DNS_RECORDS_RECEIVE_RESOURCE: mapReducers(dnsRecordsReducers.receiveResourceDetails, dnsRecordsReducers.resourceDetailsFailed),


}, InitialState)

//SELECTOR
export const getById = ( resources, id ) => {
  return resources.find( item => item.get('id') === id)
}
