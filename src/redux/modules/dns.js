import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { urlBase, parseResponseData, mapReducers, shouldCallApi } from '../util'

const SOA_RECORD_EDITED = 'SOA_RECORD_EDITED'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const DOMAIN_EDITED = 'DOMAIN_EDITED'
const DOMAIN_FETCHED_ALL = 'DOMAIN_FETCHED_ALL'
const DOMAIN_FETCHED = 'DOMAIN_FETCHED'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
const CHANGE_ACTIVE_RECORD_TYPE = 'CHANGE_ACTIVE_RECORD_TYPE'

export const initialState = fromJS({
  activeRecordType: null,
  activeDomain: undefined,
  domainToEdit: undefined,
  domains: []
})

// REDUCERS

export function editSOARecord(state, action) {
  const index = state.get('domains').findIndex(domain => domain.get('id') === action.payload.id)
  return state.setIn(['domains', index, 'SOARecord'], fromJS(action.payload.data))
}

export function createSuccess(state, action) {
  return state.merge({
    SOARecord: action.payload
  })
}

export function fetchedAllDomainsSuccess(state, action) {
  return state.merge({
    domains: fromJS(action.payload.map(domain => ({ id: domain })))
  })
}

export function fetchedDomain(state, { payload: { data, domain } }) {
  const index = state.get('domains')
    .findIndex(item => item.get('id') === domain && !item.get('details'))
  return state.merge({
    domains: state.get('domains').set(index, fromJS({ details: data, id: domain }))
  })
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
 * Thunks, helpers and selectors
 */

export const shouldFetchDomain = (domains, item) =>
  domains.findIndex(domain => domain.id === item && domain.details) < 0

export const shouldFetchDomains = (domains) => domains.length === 0

export const fetchDomainsIfNeeded = (domains, brand) => dispatch => {
  if (shouldFetchDomains(domains)) {
    dispatch(fetchDomains(brand))
      .then(({ payload }) => {
        dispatch(changeActiveDomain(payload[0]))
      })
  }
}

export const fetchDomainIfNeeded = (domains, domain, brand) => dispatch => {
  if (shouldFetchDomain(domains, domain)) {
    dispatch(fetchDomain(brand, domain))
  }
}
export default handleActions({
  DOMAIN_FETCHED_ALL: mapReducers(fetchedAllDomainsSuccess, fetchedAllDomainsFailure),
  DOMAIN_FETCHED: fetchedDomain,
  SOA_RECORD_EDITED: editSOARecord,
  DOMAIN_CREATED: createSuccess,
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

export const createDomain = createAction(DOMAIN_CREATED, (brand, domain, data) =>
  axios.post(`${urlBase}/VCDN/v2/brands/${brand}/zones/${domain}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(parseResponseData)
)

export const editDomain = createAction(DOMAIN_EDITED, (brand, name, data) =>
  axios.put(`${urlBase}/VCDN/v2/brands/${brand}/zones/${name}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(parseResponseData)
)

export const editSOA = createAction(SOA_RECORD_EDITED)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN)
export const changeActiveRecordType = createAction(CHANGE_ACTIVE_RECORD_TYPE)

