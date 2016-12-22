import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dns-domain-edit-form')
import DnsDomainEditForm from '../dns-domain-edit-form'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const fieldMock = {
  touched: 'foo',
  error: 'bar'
}

const fieldsMock = {
  name: fieldMock,
  email_addr: fieldMock,
  name_server: fieldMock,
  refresh: fieldMock,
  ttl: fieldMock,
  negative_ttl: fieldMock
}

describe('DnsDomainEditForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        errors: {},
        fields: fieldsMock,
        intl: intlMaker()
      }
      return shallow(<DnsDomainEditForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
