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
          email: 'foo',
          roles: Immutable.List('foo'),
          groups: 'foo',
          first_name: 'foo',
          last_name: 'foo',
          phone_number: 'foo',
        })
      }
      return shallow(<UserEditModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
