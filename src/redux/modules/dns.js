import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import axios from 'axios'

import { urlBase, parseResponseData } from '../util'

const SOA_RECORD_EDITED = 'SOA_RECORD_EDITED'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const DOMAIN_EDITED = 'DOMAIN_EDITED'
const DOMAIN_FETCHED_ALL = 'DOMAIN_FETCHED_ALL'
const DOMAIN_FETCHED = 'DOMAIN_FETCHED'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
const CHANGE_ACTIVE_RECORD_TYPE = 'CHANGE_ACTIVE_RECORD_TYPE'

export const initialState = fromJS({
  activeRecordType: null,
  activeDomain: { id: 1, name: 'kung-fu.com' },
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
    domains: action.payload
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

export default handleActions({
  DOMAIN_FETCHED_ALL: handleActions(fetchedAllDomainsSuccess, fetchedAllDomainsFailure),
  SOA_RECORD_EDITED: editSOARecord,
  DOMAIN_CREATED: createSuccess,
  CHANGE_ACTIVE_DOMAIN: activeDomainChange,
  CHANGE_ACTIVE_RECORD_TYPE: activeRecordTypeChange
}, initialState)

// ACTIONS
export const fetchDomains = createAction(DOMAIN_FETCHED_ALL, () =>
  axios.get(`${urlBase}/v2/brands/udn/zones`).then(parseResponseData))

export const editSOA = createAction(SOA_RECORD_EDITED)
export const createDomain = createAction(DOMAIN_CREATED)
export const editDomain = createAction(DOMAIN_EDITED)
export const fetchDomain = createAction(DOMAIN_FETCHED)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN)
export const changeActiveRecordType = createAction(CHANGE_ACTIVE_RECORD_TYPE)

