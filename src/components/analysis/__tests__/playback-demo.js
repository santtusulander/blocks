import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../playback-demo.jsx')
const PlaybackDemo = require('../playback-demo.jsx')

// Set up mocks to make sure formatting libs are used correctly
/*const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})
*/
describe('PlaybackDemo', () => {
  it('should exist', () => {
    let demo = TestUtils.renderIntoDocument(
      <PlaybackDemo />
    );
    expect(TestUtils.isCompositeComponent(demo)).toBeTruthy();
  });
})
