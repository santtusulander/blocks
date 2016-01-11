import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../cache.jsx')
const ConfigurationCache = require('../cache.jsx')

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
        config={Immutable.fromJS({response_policies: [
          {
            defaults: {
              match: "*",
              policies: [
                {
                  honor_origin_cache_policies: true
                }
              ]
            }
          }
        ]})}/>
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cache, 'input');
    inputs[0].checked = true
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0].toJS()).toEqual([
      'response_policies',
      0,
      'defaults',
      'policies',
      0,
      'honor_origin_cache_policies'
    ])
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <ConfigurationCache saveChanges={saveChanges}
        config={Immutable.fromJS({response_policies: [
          {
            defaults: {
              match: "*",
              policies: [
                {
                  honor_origin_cache_policies: true
                }
              ]
            }
          }
        ]})}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(cache, 'form');
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
