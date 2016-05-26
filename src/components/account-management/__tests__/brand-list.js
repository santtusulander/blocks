import React from 'react'

import { shallow, render, mount } from 'enzyme'

jest.dontMock('../brand-list.jsx')
const BrandList = require('../brand-list.jsx').BrandList

const fakeBrands = [
  {id: 1, logo: null, brand: 'Lorem Ipsum', availability: 'shared', lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 2, logo: null, brand: 'Lorem Ipsum', availability: 'private', lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 3, logo: null, brand: 'Lorem Ipsum', availability: 'private', lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 4, logo: null, brand: 'Lorem Ipsum', availability: 'private', lastEdited: new Date().toString(), usedBy: 'Account Name #1'}
]

describe('BrandList', () => {
  it('should exist', () => {

    const component = shallow(<BrandList brands={ fakeBrands } />)
    expect(component.find('div.brandList').length).toBe(1)
  })



})
