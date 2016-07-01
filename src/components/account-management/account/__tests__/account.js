import React from 'react'

import {shallow} from 'enzyme'
jest.unmock('../details.jsx')

import Account from '../account.jsx'

describe('AccountManagementAccountDetails', () => {
  it('should exist', () => {
    const details = shallow(
      <Account />
    )
    expect(details.length).toBe(1)
  })
})
