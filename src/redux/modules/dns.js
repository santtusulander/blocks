import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { BASE_URL_NORTH, parseResponseData, mapReducers, PAGINATION_MOCK } from '../util'

const SOA_RECORD_EDITED = 'SOA_RECORD_EDITED'
const DOMAIN_DELETED = 'DOMAIN_DELETED'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const DOMAIN_EDITED_OR_FETCHED = 'DOMAIN_EDITED_OR_FETCHED'
const DOMAIN_FETCHED_ALL = 'DOMAIN_FETCHED_ALL'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
const CHANGE_ACTIVE_RECORD_TYPE = 'CHANGE_ACTIVE_RECORD_TYPE'
const DNS_START_FETCHING = 'DNS_START_FETCHING'
const DNS_STOP_FETCHING = 'DNS_STOP_FETCHING'

export const initialState = fromJS({
  fetching: false,
  activeDomain: undefined,
  domains: []
})

// REDUCERS

export function startedFetching(state) {
  return state.merge({ fetching: true })
}

export function stoppedFetching(state) {
  return state.merge({ fetching: false })
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
  const domains = state.get('domains')
  const index = domains.findIndex(domain => domain.get('id') === payload)
  const newDomains = domains.delete(index)
  return state.merge({
    domains: newDomains,
    activeDomain: newDomains.get(0) && newDomains.get(0).get('id')
  })
}

export function deleteDomainFailure(state) {
  return state
}

export function editDomainSuccess(state, { payload: { data, domain } }) {
  const index = state.get('domains').findIndex(item => item.get('id') === domain)
  return state.merge({
    domains: state.get('domains').set(index, fromJS({ details: data, id: domain }))
  })
}

export function editDomainFailure(state) {
  return state
}

export function fetchedAllDomainsSuccess(state, { payload }) {
  return state.merge({
    domains: fromJS(payload.data.map(domain => ({ id: domain }))),
    activeDomain: state.get('activeDomain') || payload[0],
    fetching: false
  })
}

export function fetchedAllDomainsFailure(state) {
  return state.merge({
    domains: []
  })
}

export function activeDomainChange(state, { payload }) {
  return state.merge({
    activeDomain: payload
  })
}

/**
 *
 * Selectors
 */
export const domainToEdit = (domains, id) => domains.find(domain => domain.get('id') === id)

export default handleActions({
  DOMAIN_FETCHED_ALL: mapReducers(fetchedAllDomainsSuccess, fetchedAllDomainsFailure),
  DNS_START_FETCHING: startedFetching,
  DNS_STOP_FETCHING: stoppedFetching,
  DOMAIN_DELETED: mapReducers(deleteDomainSuccess, deleteDomainFailure),
  DOMAIN_CREATED: mapReducers(createDomainSuccess, createDomainFailure),
  DOMAIN_EDITED_OR_FETCHED: mapReducers(editDomainSuccess, editDomainFailure),
  CHANGE_ACTIVE_DOMAIN: activeDomainChange
}, initialState)

// ACTIONS
export const fetchDomains = createAction(DOMAIN_FETCHED_ALL, brand =>
  axios.get(`${BASE_URL_NORTH}/brands/${brand}/zones`, PAGINATION_MOCK)
    .then(parseResponseData)
)

export const fetchDomain = createAction(DOMAIN_EDITED_OR_FETCHED,
  (brand, domain) => axios.get(`${BASE_URL_NORTH}/brands/${brand}/zones/${domain}`)
    .then(({ data }) => ({ data, domain }))
)

export const deleteDomain = createAction(DOMAIN_DELETED, (brand, domain) =>
  axios.delete(`${BASE_URL_NORTH}/brands/${brand}/zones/${domain}`)
    .then(() => domain)
)

export const createDomain = createAction(DOMAIN_CREATED, (brand, domain, data) =>
  axios.post(`${BASE_URL_NORTH}/brands/${brand}/zones/${domain}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(({ data }) => ({ data, domain }))
)

export const editDomain = createAction(DOMAIN_EDITED_OR_FETCHED, (brand, domain, data) =>
  axios.put(`${BASE_URL_NORTH}/brands/${brand}/zones/${domain}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(({ data }) => ({ data, domain }))
)

export const startFetchingDomains = createAction(DNS_START_FETCHING)
export const stopFetchingDomains = createAction(DNS_STOP_FETCHING)

export const editSOA = createAction(SOA_RECORD_EDITED)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN)
export const changeActiveRecordType = createAction(CHANGE_ACTIVE_RECORD_TYPE)
