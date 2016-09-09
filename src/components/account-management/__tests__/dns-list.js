import React from 'react'
import { shallow } from 'enzyme'

import { EDIT_SOA, EDIT_DNS } from '../../../constants/account-management-modals.js'

jest.dontMock('../dns-list.jsx')
jest.dontMock('../../../redux/modules/dns.js')
const DNSList = require('../dns-list.jsx').DNSList
const fakeData = require('../../../redux/modules/dns.js').initialState

const NO_ACTIVE_DOMAIN = 'No active Domain'

describe('DNSList', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        onAddEntry: jest.fn(),
        onDeleteEntry: jest.fn(),
        onEditEntry: jest.fn(),
        searchFunc: jest.fn(),
        records: [],
        searchValue: ''

      }
    }
  })
  it('should exist', () => {
    const list = shallow(<DNSList/>)
    expect(list.length).toBe(1)
  })

  it('should show tables sorted by record type', () => {
    const list = shallow(<DNSList/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })

  it('should handle edit record button click', () => {
    const list = shallow(<DNSList
        activeDomain={fakeData.get('activeDomain')}
        domains={fakeData.get('domains')}/>)
    expect(list.find('#domain-stats').text()).not.toBe(NO_ACTIVE_DOMAIN)
  })

  it('should handle create record button click', () => {
    const list = shallow(<DNSList
      accountManagementModal={EDIT_SOA}
      />)
    expect(list.find('#soa-form').length).toBe(1)
  })

  it('should handle delete record button click', () => {
    const list = shallow(<DNSList
      accountManagementModal={EDIT_DNS}
      />)
    expect(list.find('#dns-form').length).toBe(1)
  })

  it('should handle click to add domain', () => {
    const addDomain = jest.genMockFunction()
    const list = shallow(<DNSList onAddDomain={addDomain}/>)
    list.find('#add-domain').simulate('click')
    expect(addDomain.mock.calls.length).toBe(1)
  })

  it('should handle click to edit SOA record', () => {
    const toggleModal = jest.genMockFunction()
    const list = shallow(<DNSList
      activeDomain={fakeData.get('activeDomain')}
      domains={fakeData.get('domains')}
      toggleModal={() => toggleModal(EDIT_SOA)}/>)
    list.find('#edit-soa').simulate('click')
    expect(toggleModal.mock.calls[0][0]).toBe(EDIT_SOA)
  })

  it('should handle click to add DNS record', () => {
    const toggleModal = jest.genMockFunction()
    const list = shallow(<DNSList toggleModal={() => toggleModal(EDIT_DNS)}/>)
    list.find('#add-dns-record').simulate('click')
    expect(toggleModal.mock.calls[0][0]).toBe(EDIT_DNS)
  })
})
