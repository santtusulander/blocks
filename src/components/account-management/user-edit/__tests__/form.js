import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../form')
import UserEditForm from '../form'

const fakeFields = {
  email: 'foo',
  first_name: 'foo',
  last_name: 'foo',
  phone_number: 'foo',
  role: 'foo'
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
})
