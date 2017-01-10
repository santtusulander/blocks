import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../services.jsx')
import AccountManagementSystemServices from '../services.jsx'

describe('AccountManagementSystemServices', () => {
  it('should exist', () => {
    const subject = shallow(
      <AccountManagementSystemServices />
    )
    expect(subject.length).toBe(1)
  })
})
