import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../cache.jsx')
const ConfigurationCache = require('../cache.jsx')

const fakeConfig = Immutable.fromJS({"default_policies": [
  {
    "set": {
      "cache_control": {
        "honor_origin": true,
        "check_etag": "weak"
      }
    }
  },
  {
    "set": {
      "cache_name": {
        "ignore_case": false
      }
    }
  }
]})

describe('ConfigurationCache', () => {
  it('should exist', () => {
    let cache = TestUtils.renderIntoDocument(
      <ConfigurationCache />
    );
    expect(TestUtils.isCompositeComponent(cache)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <ConfigurationCache changeValue={changeValue}
        config={fakeConfig}/>
    );
    cache.handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <ConfigurationCache saveChanges={saveChanges}
        config={fakeConfig}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(cache, 'form');
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
