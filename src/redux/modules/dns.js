import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

//import {urlBase} from '../util'

const SOA_RECORD_EDITED = 'SOA_RECORD_EDITED'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'

export const initialState = fromJS({
  activeRecordType: 'AAAA',
  activeDomain: { id: 1, name: 'kung-fu.com' },
  domains: [
    {
      id: 1,
      name: 'kung-fu.com',
      SOARecord: {
        domainName: 'aaa',
        nameServer: 'bbb',
        personResponsible: 'aaa@bbb.com',
        zoneSerialNumber: 123,
        refresh: 123
      },
      subDomains: [
        {id: 1, hostName: 'aaa.com', type: 'A', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 2, hostName: 'bbb.com', type: 'AAAA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 3, hostName: 'vvv.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 4, hostName: 'ccc.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 5, hostName: 'nnn.com', type: 'TXT', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'}
      ]
    },
    {
      id: 2,
      name: 'kunfu.fi',
      SOARecord: {
        domainName: 'bbb',
        nameServer: 'ccc',
        personResponsible: 'ooo@ggg.com',
        zoneSerialNumber: 123,
        refresh: 123
      },
      subDomains: [
        {id: 1, hostName: 'eee.com', type: 'AAAA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 2, hostName: 'rrr.com', type: 'A', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 3, hostName: 'ttt.com', type: 'TXT', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
        {id: 5, hostName: 'uuu.com', type: 'TXT', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'}
      ]
    }
  ]
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

export function changeActive(state, action) {
  return state.merge({
    SOARecord: action.payload
  })
}

export default handleActions({
  SOA_RECORD_EDITED: editSOARecord,
  DOMAIN_CREATED: createSuccess,
  CHANGE_ACTIVE_DOMAIN: changeActive
}, initialState)

// ACTIONS

export const editSOA = createAction(SOA_RECORD_EDITED, data => data)
export const createDomain = createAction(DOMAIN_CREATED, data => data)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN, data => data)

