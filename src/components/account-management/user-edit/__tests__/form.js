import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../form')
import UserEditForm from '../form'

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
        fields: fakeFields
      }
      return shallow(<UserEditForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 3 inputs', () => {
    expect(subject().find('FormControl').length).toBe(3)
  })

  it('should have 1 select', () => {
    expect(subject().find('SelectWrapper').length).toBe(1)
  })

  it('should have 1 telephone input', () => {
    expect(subject().find('.user-form__telephone').length).toBe(1)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })
})
