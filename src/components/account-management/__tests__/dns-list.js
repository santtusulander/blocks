import React from 'react'
import { shallow, mount } from 'enzyme'

jest.unmock('../../../constants/dns-record-types')
jest.unmock('../dns-list')
jest.unmock('../../table-sorter')
import DNSList, { SortableTable } from '../dns-list'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const recs = [
  {id: 1, "class": "IN", "type": "MX", "name": "d", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 2, "class": "IN", "type": "A", "name": "a", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 3, "class": "IN", "type": "AAAA", "name": "b", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600},
  {id: 4, "class": "IN", "type": "TXT", "name": "c", "value": {"prio": 123, "value": "169.50.9.60"}, "ttl": 3600}
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
        hiddenRecordCount: 'aaa',
        visibleRecordCount: 'bbb',
        intl:intlMaker(),
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
    expect(subject(recs).find('#record-amount-label').children().nodes).toContain('aaa')
    expect(subject(recs).find('#record-amount-label').children().nodes).toContain('bbb')
  })

  it('should show correct type label per table, sorted correctly', () => {
    expect(subject(recs).find('#table-label-0').props().children[0]).toEqual('A')
    expect(subject(recs).find('#table-label-1').props().children[0]).toEqual('AAAA')
    expect(subject(recs).find('#table-label-5').props().children[0]).toEqual('MX')
    expect(subject(recs).find('#table-label-11').props().children[0]).toEqual('TXT')
  })

  it('should handle create record button click', () => {
    subject().find('#add-dns-record').simulate('click')
    expect(onAddEntry.mock.calls.length).toBe(1)
  })

})

describe('SortableTable', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        content: sortingFunc => sortingFunc(recs).map((item, index) => <tr id={`${item.name}-${index}`}/>)
      }
      return mount(<SortableTable {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should change sortDirection on clicking sortable column header', () => {
    const component = subject()
    component.find('a').simulate('click')
    expect(component.state('sortDirection')).toBe(-1)
  })

  it('should render records alphabetically, in ascending order', () => {
    expect(subject().find('#a-0').length).toBe(1)
  })


})
