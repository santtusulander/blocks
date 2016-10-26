import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../response-code.jsx')
jest.unmock('../../../../util/status-codes')

import ResponseCode from '../response-code.jsx'

describe('FilterResponseCode', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ResponseCode/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
