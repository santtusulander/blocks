import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../modal')
import UserEditModal from '../modal'

describe('UserEditModal', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        user: Immutable.Map({
          email: {
            value: 'foo'
          },
          roles: Immutable.List('foo'),
          groups: {
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
          }
        })
      }
      return shallow(<UserEditModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
