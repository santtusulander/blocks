import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../../constants/dns-record-types')
jest.unmock('../../../components/shared/layout/section-container')
jest.unmock('../../../components/shared/layout/section-header')
jest.unmock('../../../components/action-buttons')
jest.unmock('../../../components/shared/icon')
jest.unmock('../../../components/shared/icons/icon-edit')
jest.unmock('../../../components/shared/icons/icon-trash')
jest.unmock('../dns-record-table')
jest.unmock('../../table-sorter')
jest.unmock('../../button')
jest.unmock('../dns-list')
import DNSList from '../dns-list'
import { DNSRecordTable } from '../dns-record-table'
import recordTypes, { recordFields } from '../../../constants/dns-record-types'

function intlMaker() {
  return {
    formatMessage: jest.fn(),
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
        hiddenRecordCount: 'hiddens',
        visibleRecordCount: 'visibles',
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
    expect(subject(recs).childAt(0).html()).toContain('hiddens')
    expect(subject(recs).childAt(0).html()).toContain('visibles')
  })

  it('should show correct type label per table, sorted correctly', () => {
    expect(subject(recs).children().nodes[1].props.children[0].props.sectionSubHeaderTitle).toContain('A')
    expect(subject(recs).children().nodes[2].props.children[0].props.sectionSubHeaderTitle).toContain('AAAA')
    expect(subject(recs).children().nodes[3].props.children[0].props.sectionSubHeaderTitle).toContain('MX')
    expect(subject(recs).children().nodes[4].props.children[0].props.sectionSubHeaderTitle).toContain('TXT')
  })

  it('should handle create record button click', () => {
    subject().find('#add-dns-record').simulate('click')
    expect(onAddEntry.mock.calls.length).toBe(1)
  })

})

describe('DNSRecordTable', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        content: sortingFunc => sortingFunc(recs).map((item, index) => <tr key={index} id={`${item.name}-${index}`}/>)
      }
      return shallow(<DNSRecordTable {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  // TODO: figure out how to make this work without mounting the whole component
  // it('should change sortDirection on clicking sortable column header', () => {
  //   const component = subject()
  //   component.find('a').simulate('click')
  //   expect(component.state('sortDirection')).toBe(-1)
  // })

  it('should render records alphabetically, in ascending order', () => {
    expect(subject().find('#a-0').length).toBe(1)
  })

})
