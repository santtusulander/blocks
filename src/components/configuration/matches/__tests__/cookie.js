import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../cookie.jsx')
const Cookie = require('../cookie.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('Redirection', () => {
  it('should exist', () => {
    let cookie = TestUtils.renderIntoDocument(
      <Cookie match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(cookie)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cookie = TestUtils.renderIntoDocument(
      <Cookie changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cookie, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let cookie = TestUtils.renderIntoDocument(
      <Cookie changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(cookie.state.activeFilter).toBe('exists')
    cookie.handleSelectChange('activeFilter')('foo')
    expect(cookie.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
