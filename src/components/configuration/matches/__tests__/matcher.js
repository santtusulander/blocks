import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../matcher.jsx')
const Matcher = require('../matcher.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('Matcher', () => {
  it('should exist', () => {
    let matcher = TestUtils.renderIntoDocument(
      <Matcher match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(matcher)).toBeTruthy();
  })

  it('should update the state as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let matcher = TestUtils.renderIntoDocument(
      <Matcher changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(matcher, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(matcher.state.val).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let matcher = TestUtils.renderIntoDocument(
      <Matcher changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(matcher.state.activeFilter).toBe('exists')
    matcher.handleMatchesChange('foo')
    expect(matcher.state.activeFilter).toBe('foo')
  })

  it('should save changes', () => {
    const changeValue = jest.genMockFunction()
    const close = jest.genMockFunction()
    let matcher = TestUtils.renderIntoDocument(
      <Matcher changeValue={changeValue} match={fakeConfig} path={fakePath}
        close={close}/>
    )
    matcher.setState({
      val: 'aaa'
    })
    matcher.saveChanges()
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('aaa')
    expect(close.mock.calls.length).toBe(1)
  })
})
