import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../global-account-selector/selector-component')
jest.unmock('../domain-toolbar')
import DomainToolbar from '../domain-toolbar'

const fakeDomains = [ { id: 'asdsa' }, { id: 'asdsa' }, { id: 'asdsa' } ]

describe('Domain Toolbar', () => {
  let props = {}
  let subject = null
  const onAddDomain = jest.fn()
  const onEditDomain = jest.fn()
  const changeActiveDomain = jest.fn()

  beforeEach(() => {
    subject = (activeDomain, domains, searchValue) => {
      props = {
        activeDomain: activeDomain,
        domains: domains || [],
        searchValue: searchValue || '',
        onAddDomain,
        onEditDomain,
        changeActiveDomain,
        searchFunc: jest.genMockFunction(),
        emptyDomainsTxt: 'bb'
      }
      return shallow(<DomainToolbar {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should not show Edit button', () => {
    expect(subject().find('#edit-domain').length).toBe(0)
  });

  it('should show Edit button', () => {
    expect(subject('aa').find('#edit-domain').length).toBe(1)
  });

  it('should show DomainSelector', () => {
    expect(subject(null, fakeDomains).find('#domain-selector').length).toBe(1)
    expect(subject(null, [], 'asd').find('#domain-selector').length).toBe(1)
  });

  it('should show empty domains-message', () => {
    expect(subject().find('#empty-domains-text').length).toBe(1)
  });

  it('should handle onAddDomain', () => {
    subject().find('#add-domain').simulate('click')
    expect(onAddDomain.mock.calls.length).toBe(1)
  });

  it('should handle onEditDomain', () => {
    subject('aa').find('#edit-domain').simulate('click')
    expect(onEditDomain.mock.calls.length).toBe(1)

  });

})
