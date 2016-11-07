import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../property.jsx')
import Property from '../property.jsx'

describe('FilterProperty', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<Property/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
