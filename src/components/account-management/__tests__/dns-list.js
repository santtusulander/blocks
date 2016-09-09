import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../../constants/dns-record-types')
jest.unmock('../dns-list')
import DNSList from '../dns-list'

const recs = [
  {id: 'a', "class": "IN", "type": "MX", "name": "cis-gluster-processing-node0.fra.cdx-dev.unifieddeliverynetwork.net", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 'b', "class": "IN", "type": "A", "name": "cis-gluster-processing-node0.fra.cdx-dev.unifieddeliverynetwork.net", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 'c', "class": "IN", "type": "AAAA", "name": "cis-gluster-processing-node0.fra.cdx-dev.unifieddeliverynetwork.net", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 'd', "class": "IN", "type": "TXT", "name": "cis-gluster-processing-node0.fra.cdx-dev.unifieddeliverynetwork.net", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600}
]

describe('DNSList', () => {
  let subject = null
  let props = {}
  const onAddEntry = jest.fn()
  const onDeleteEntry = jest.fn()
  const onEditEntry = jest.fn()
  beforeEach(() => {
    subject = records => {
      props = {
        onAddEntry,
        onDeleteEntry,
        onEditEntry,
        searchFunc: jest.fn(),
        records: records || [],
        searchValue: ''
      }
      return shallow(<DNSList {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show correct amount of records', () => {
    expect(subject(recs).find('#record-amount-label').props().children).toBe('4 Records')
  })

  it('should show correct type label per table, sorted correctly', () => {
    expect(subject(recs).find('#table-label-0').props().children).toEqual([ 'A', ' Records' ])
    expect(subject(recs).find('#table-label-1').props().children).toEqual([ 'AAAA', ' Records' ])
    expect(subject(recs).find('#table-label-5').props().children).toEqual([ 'MX', ' Records' ])
    expect(subject(recs).find('#table-label-11').props().children).toEqual([ 'TXT', ' Records' ])
  })

  it('should handle create record button click', () => {
    subject().find('#add-dns-record').simulate('click')
    expect(onAddEntry.mock.calls.length).toBe(1)
  })

})
