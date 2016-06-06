import React from 'react'

import {shallow} from 'enzyme'
jest.unmock('../details.jsx')

import Details from '../details.jsx'

describe('AccountManagementAccountDetails', () => {
  it('should exist', () => {
    const details = shallow(
      <Details />
    )
    expect(details.length).toBe(1)
  })
})
