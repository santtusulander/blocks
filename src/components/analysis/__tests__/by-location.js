import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../by-location.jsx')
const AnalysisByLocation = require('../by-location.jsx').AnalysisByLocation

function topoActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchCountries: jest.genMockFunction()
  }
}

describe('AnalysisByLocation', () => {
  it('should exist', () => {
    let byLocation = TestUtils.renderIntoDocument(
      <AnalysisByLocation topoActions={topoActionsMaker()} />
    );
    expect(TestUtils.isCompositeComponent(byLocation)).toBeTruthy();
  });
})
