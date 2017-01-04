import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../form-container')
import AccountManagementFormContainer from '../form-container'

describe('AccountManagementFormContainer', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AccountManagementFormContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
