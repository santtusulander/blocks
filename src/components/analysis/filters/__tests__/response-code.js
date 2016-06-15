import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../response-code.jsx')
const ResponseCode = require('../response-code.jsx')

describe('FilterResponseCode', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ResponseCode/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
