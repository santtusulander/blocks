import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache-rule.jsx')
const ConfigurationCacheRule = require('../cache-rule.jsx')

describe('ConfigurationCacheRule', () => {
  it('should exist', () => {
    let cacheRule = TestUtils.renderIntoDocument(
      <ConfigurationCacheRule />
    );
    expect(TestUtils.isCompositeComponent(cacheRule)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let cacheRule = TestUtils.renderIntoDocument(
      <ConfigurationCacheRule changeValue={changeValue} />
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cacheRule, 'input');
    inputs[1].value = "new"
    TestUtils.Simulate.change(inputs[1])
    expect(changeValue.mock.calls[0][0]).toEqual(['path'])
    expect(changeValue.mock.calls[0][1]).toBe('new')
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let cacheRule = TestUtils.renderIntoDocument(
      <ConfigurationCacheRule saveChanges={saveChanges}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(cacheRule, 'form');
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
