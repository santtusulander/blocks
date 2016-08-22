import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { urlBase, parseResponseData, mapReducers } from '../util'

const SOA_RECORD_EDITED = 'SOA_RECORD_EDITED'
const DOMAIN_DELETED = 'DOMAIN_DELETED'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const DOMAIN_EDITED = 'DOMAIN_EDITED'
const DOMAIN_FETCHED_ALL = 'DOMAIN_FETCHED_ALL'
const DOMAIN_FETCHED = 'DOMAIN_FETCHED'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
const CHANGE_ACTIVE_RECORD_TYPE = 'CHANGE_ACTIVE_RECORD_TYPE'
const DNS_START_FETCHING = 'DNS_START_FETCHING'
const DNS_STOP_FETCHING = 'DNS_STOP_FETCHING'

export const initialState = fromJS({
  loading: false,
  activeDomain: undefined,
  domains: []
})

// REDUCERS

export function startedFetching(state) {
  return state.merge({ loading: true })
}

export function stoppedFetching(state) {
  return state.merge({ loading: false })
}

export function createDomainSuccess(state, { payload: { data, domain } }) {
  return state.merge({
    domains: state.get('domains').push(fromJS({ details: data, id: domain }))
  })
}

export function createDomainFailure(state) {
  return state
}

export function deleteDomainSuccess(state, { payload }) {
  const index = state.get('domains').findIndex(domain => domain.get('id') === payload)
  return state.merge({
    domains: state.get('domains').delete(index)
  })
}

export function deleteDomainFailure(state) {
  return state
}

export function editDomainSuccess(state, { payload: { domain, data } }) {
  const index = state.get('domains').findIndex(domain => domain.get('id') === domain)
  return state.merge({
    domains: state.get('domains').set(index, fromJS({ details: data, id: domain }))
  })
}

export function editDomainFailure(state) {
  return state
}

export function fetchedAllDomainsSuccess(state, action) {
  return state.merge({
    domains: fromJS(action.payload.map(domain => ({ id: domain })))
  })
}

export function fetchedDomainSuccess(state, { payload: { data, domain } }) {
  const index = state.get('domains')
    .findIndex(item => item.get('id') === domain && !item.get('details'))
  return state.merge({
    domains: state.get('domains').set(index, fromJS({ details: data, id: domain }))
  })
}

export function fetchedDomainFailure(state) {
  return state
}

export function fetchedAllDomainsFailure(state) {
  return state.merge({
    domains: []
  })
}

export function activeDomainChange(state, action) {
  return state.merge({
    activeDomain: action.payload
  })
}

export function activeRecordTypeChange(state, action) {
  return state.merge({
    activeRecordType: action.payload
  })
}

/**
 *
 * Thunks and helper functions
 */

export const shouldFetchDomain = (domains, item) =>
  domains.findIndex(domain => domain.id === item && domain.details) < 0

export const shouldFetchDomains = (domains) => domains.length === 0

export const fetchDomainsIfNeeded = (domains, brand) => dispatch => {
  if (shouldFetchDomains(domains)) {
    dispatch(startFetching())
    dispatch(fetchDomains(brand))
      .then(({ payload }) => {
        dispatch(changeActiveDomain(payload[0]))
      }).then(dispatch(stopFetching()))
  }
}

export const fetchDomainIfNeeded = (domains, domain, brand) => dispatch => {
  if (shouldFetchDomain(domains, domain)) {
    dispatch(fetchDomain(brand, domain)).then(dispatch(stopFetching()))
  }
}

export default handleActions({
  DOMAIN_FETCHED_ALL: mapReducers(fetchedAllDomainsSuccess, fetchedAllDomainsFailure),
  DOMAIN_FETCHED: mapReducers(fetchedDomainSuccess, fetchedDomainFailure),
  DNS_START_FETCHING: startedFetching,
  DNS_STOP_FETCHING: stoppedFetching,
  DOMAIN_DELETED: mapReducers(deleteDomainSuccess, deleteDomainFailure),
  DOMAIN_CREATED: mapReducers(createDomainSuccess, createDomainFailure),
  DOMAIN_EDITED: mapReducers(editDomainSuccess, editDomainFailure),
  CHANGE_ACTIVE_DOMAIN: activeDomainChange,
  CHANGE_ACTIVE_RECORD_TYPE: activeRecordTypeChange
}, initialState)

// ACTIONS
export const fetchDomains = createAction(DOMAIN_FETCHED_ALL, brand =>
  axios.get(`${urlBase}/VCDN/v2/brands/${brand}/zones`).then(parseResponseData))

export const fetchDomain = createAction(DOMAIN_FETCHED,
  (brand, domain) => axios.get(`${urlBase}/VCDN/v2/brands/${brand}/zones/${domain}`)
    .then(data => ({ data, domain }))
)

export const deleteDomain = createAction(DOMAIN_DELETED, (brand, domain) =>
  axios.delete(`${urlBase}/VCDN/v2/brands/${brand}/zones/${domain}`)
    .then(() => domain)
)

export const createDomain = createAction(DOMAIN_CREATED, (brand, domain, data) =>
  axios.post(`${urlBase}/VCDN/v2/brands/${brand}/zones/${domain}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(data => ({ data, domain }))
)

export const editDomain = createAction(DOMAIN_EDITED, (brand, domain, data) =>
  axios.put(`${urlBase}/VCDN/v2/brands/${brand}/zones/${domain}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(parseResponseData)
)

const startFetching = createAction(DNS_START_FETCHING)
const stopFetching = createAction(DNS_STOP_FETCHING)

export const editSOA = createAction(SOA_RECORD_EDITED)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN)
export const changeActiveRecordType = createAction(CHANGE_ACTIVE_RECORD_TYPE)

