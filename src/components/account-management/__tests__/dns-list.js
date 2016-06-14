import React from 'react'
import { shallow } from 'enzyme'

import { EDIT_SOA, EDIT_DNS } from '../../../constants/account-management-modals.js'

jest.dontMock('../dns-list.jsx')
jest.dontMock('../../../redux/modules/dns.js')
const DNSList = require('../dns-list.jsx').DNSList
const fakeData = require('../../../redux/modules/dns.js').initialState

const NO_ACTIVE_DOMAIN = 'No active Domain'

describe('DNSList', () => {

  it('should exist', () => {
    const list = shallow(<DNSList/>)
    expect(list.length).toBe(1)
  })

  it('should show empty message for entries', () => {
    const list = shallow(<DNSList/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })

  it('should show no active domain message', () => {
    const list = shallow(<DNSList/>)
    expect(list.find('#domain-stats').text()).toBe(NO_ACTIVE_DOMAIN)
  })

  it('should show message for active domain', () => {
    const list = shallow(<DNSList
        activeDomain={fakeData.get('activeDomain')}
        domains={fakeData.get('domains')}/>)
    expect(list.find('#domain-stats').text()).not.toBe(NO_ACTIVE_DOMAIN)
  })

  it('should show SOA edit modal', () => {
    const list = shallow(<DNSList
      accountManagementModal={EDIT_SOA}
      />)
    expect(list.find('#soa-form').length).toBe(1)
  })

  it('should show DNS edit modal', () => {
    const list = shallow(<DNSList
      accountManagementModal={EDIT_DNS}
      />)
    expect(list.find('#dns-form').length).toBe(1)
  })

  it('should not show modal', () => {
    const list = shallow(<DNSList accountManagementModal={null}/>)
    expect(list.find('#dns-form').length).toBe(0)
    expect(list.find('#soa-form').length).toBe(0)
  })

  it('should list entries', () => {
    const list = shallow(<DNSList
      activeDomain={fakeData.get('activeDomain')}
      domains={fakeData.get('domains')}/>)
    expect(list.find('tbody tr').length).toBe(5)
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
