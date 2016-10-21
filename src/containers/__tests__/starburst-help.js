import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.unmock('../starburst-help.jsx')
import StarburstHelp from '../starburst-help.jsx'

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
