import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../traffic.jsx')
const AnalysisTraffic = require('../traffic.jsx')

describe('AnalysisTraffic', () => {
  it('should exist', () => {
    let traffic = TestUtils.renderIntoDocument(
      <AnalysisTraffic
        byTime={Immutable.List()}
        byCountry={Immutable.List()}/>
    );
    expect(TestUtils.isCompositeComponent(traffic)).toBeTruthy();
  });
})
