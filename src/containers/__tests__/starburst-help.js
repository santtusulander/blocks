import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../starburst-help.jsx')
const StarburstHelp = require('../starburst-help.jsx')

const fakeHistory = {
  goBack: jest.genMockFunction()
}

describe('StarburstHelp', () => {
  it('should exist', () => {
    const starburstHelp = TestUtils.renderIntoDocument(
      <StarburstHelp history={fakeHistory} />
    )
    expect(TestUtils.isCompositeComponent(starburstHelp)).toBeTruthy()
  })
})
