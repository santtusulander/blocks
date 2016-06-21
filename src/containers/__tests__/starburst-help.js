import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../starburst-help.jsx')
const StarburstHelp = require('../starburst-help.jsx')

describe('StarburstHelp', () => {
  it('should exist', () => {
    const starburstHelp = TestUtils.renderIntoDocument(
      <StarburstHelp />
    )
    expect(TestUtils.isCompositeComponent(starburstHelp)).toBeTruthy()
  })
})
