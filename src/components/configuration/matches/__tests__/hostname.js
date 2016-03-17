import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../hostname.jsx')
const Hostname = require('../hostname.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('Hostname', () => {
  it('should exist', () => {
    let hostname = TestUtils.renderIntoDocument(
      <Hostname match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(hostname)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let hostname = TestUtils.renderIntoDocument(
      <Hostname changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(hostname, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let hostname = TestUtils.renderIntoDocument(
      <Hostname changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(hostname.state.activeFilter).toBe('matches')
    hostname.handleSelectChange('activeFilter')('foo')
    expect(hostname.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
