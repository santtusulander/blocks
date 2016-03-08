import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache.jsx')
const Cache = require('../cache.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('Cache', () => {
  it('should exist', () => {
    let cache = TestUtils.renderIntoDocument(
      <Cache set={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(cache)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <Cache changeValue={changeValue} set={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cache, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'max_age'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
