import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../domain-toolbar')
//jest.unmock('../../is-allowed')
jest.unmock('react-intl')
import DomainToolbar from '../domain-toolbar'

describe('Button', () => {
  let props = {}
  let subject = null

  beforeEach(() => {
    subject = (activeDomain, domains, searchValue) => {
      props = {
        activeDomain: activeDomain,
        domains: domains || [],
        searchValue: searchValue || '',
        onAddDomain: jest.genMockFunction(),
        onEditDomain: jest.genMockFunction(),
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
    expect(subject().find('IsAllowed').length).toBe(1)
  });

  it('should show Edit button', () => {
    expect(subject('aa').find('IsAllowed').length).toBe(1)
  });

  it('should show DomainSelector', () => {
    expect(subject(null, [ 'aa', 'bb' ]).find('DomainSelector').length).toBe(1)
    expect(subject(null, [], 'asd').find('DomainSelector').length).toBe(1)
  });

  it('should show empty domains-message', () => {
    expect(subject(null, []).find('#empty-domains-text').length).toBe(1)
    expect(subject(null, [ 'aa', 'bb' ], '').find('#empty-domains-text').length).toBe(1)
  });
})
