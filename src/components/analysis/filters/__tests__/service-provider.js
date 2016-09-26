import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../service-provider.jsx')
const ServiceProvider = require('../service-provider.jsx')

const fakeOptions = Immutable.List([
  Immutable.Map({
    id: 1,
    name: 'foo'
  })
])

describe('FilterServiceProvider', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ServiceProvider options={fakeOptions}/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
