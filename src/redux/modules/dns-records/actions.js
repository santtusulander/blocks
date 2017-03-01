import uniqid from 'uniqid'
import { fromJS } from 'immutable'
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
  fetching: false,
  resources: []
})

const domainlessRecordName = (zone, recordName) => {
  return recordName.replace(new RegExp('.' + zone + '$', 'i'), '')
}

//ACTIONS
export const fetchResourcesList = createAction(DNS_RECORDS_RECEIVE_RESOURCES, zone => {
  return dnsRecordsApi.fetchAll(zone)
})

export const fetchResourceDetails = createAction(DNS_RECORDS_RECEIVE_RESOURCE, (zone, resource)  => {
  return dnsRecordsApi.fetchDetailsByName(zone, resource)
})

export const createResource = createAction(DNS_RECORDS_CREATED, (zone, resource, data) => {

  //If resource for NS record is empty - use zone as resource and record name
  if (data.type === 'NS' && !resource) {
    data.name = zone
    resource = zone
  } else {
    data.name = data.name.concat('.' + zone)
    resource = resource.concat('.' + zone)
  }

  return dnsRecordsApi.create(zone, resource, data).then(resource => {
    resource.data.name = domainlessRecordName(zone, resource.data.name)
    return resource
  })
})

export const removeResource = createAction(DNS_RECORDS_DELETED, (zone, resource, data) => {
  let isNSRecordWithEmptyResource = (data.type === 'NS' && data.name === zone)
  let recordName = isNSRecordWithEmptyResource ? zone : data.name.concat('.' + zone)
  resource = isNSRecordWithEmptyResource ? resource : resource.concat('.' + zone)

  const recordToDelete = {
    name: recordName,
    type: data.type,
    value: data.value
  }
  return dnsRecordsApi.remove(zone, resource, recordToDelete)
})

export const updateResource = createAction(DNS_RECORDS_UPDATED, (zone, resource, data) => {
  let isNSRecordWithEmptyResource = (data.type === 'NS' && data.name === zone || data.type === 'NS' && data.name === '')
  data.name = isNSRecordWithEmptyResource ? zone : data.name.concat('.' + zone)
  resource = isNSRecordWithEmptyResource ? resource : resource.concat('.' + zone)

  const { id, ...apiData } = data
  return dnsRecordsApi.update(zone, resource, apiData)
    .then(({ data }) => {
      data.name = domainlessRecordName(zone, data.name)
      return { data, id }
    })
})

export const fetchResourcesWithDetails = createAction(DNS_RECORD_RECEIVE_WITH_DETAILS, (zone) => {
  return dnsRecordsApi.fetchAll(zone)
    .then((response) => {
      let responseData = response.data.data

      // UDNP-2883:
      // Since records data model that comes from back-end was changed - convert it to previous
      // structure to avoid lot of refactoring/fixes (it can be done in the future)
      responseData.forEach((item) => {
        Object.assign(item, item.entries[0])
        delete item.entries
      })

      return responseData.map( record => {
        record.id = uniqid()
        record.name = domainlessRecordName(zone, record.dns_record_id)
        return record
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
