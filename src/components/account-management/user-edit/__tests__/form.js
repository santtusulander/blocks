import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../form')
import UserEditForm from '../form'

function intlMaker() {
  return {
   formatMessage: jest.fn()
  }
}

const fakeFields = {
  email: {
    value: 'foo'
  },
  first_name: {
    value: 'foo'
  },
  last_name: {
    value: 'foo'
  },
  phone: {
    value: 'foo'
  },
  phone_number: {
    value: 'foo'
  },
  phone_country_code: {
    value: 'foo'
  },
  role: {
    value: 'foo'
  }
}

describe('UserEditForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        handleSubmit: jest.genMockFunction(),
        intl: intlMaker(),
      }
      return shallow(<UserEditForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 5 Fields', () => {
    expect(subject().find('Fields').length).toBe(1)
    expect(subject().find('Field').length).toBe(4)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })
})
