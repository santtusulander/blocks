import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

const Configuration = require('../configuration.jsx').Configuration

function hostActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchHost: jest.genMockFunction(),
    createHost: jest.genMockFunction(),
    deleteHost: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', version: '3'}

describe('Configuration', () => {
  it('should exist', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        params={urlParams}/>
    );
    expect(TestUtils.isCompositeComponent(config)).toBeTruthy();
  });
})
