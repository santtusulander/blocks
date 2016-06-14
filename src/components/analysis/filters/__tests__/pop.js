import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../pop.jsx')
const Pop = require('../pop.jsx')

describe('FilterPop', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<Pop/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
