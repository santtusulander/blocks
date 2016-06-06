import React from 'react'

import {shallow} from 'enzyme'

jest.unmock('../brands.jsx')

import Brands from '../brands.jsx'

describe('AccountManagementSystemBrands', () => {
  it('should exist', () => {
    const brands = shallow(
      <Brands />
    )
    expect( brands.length ).toBe(1)
  })
})
