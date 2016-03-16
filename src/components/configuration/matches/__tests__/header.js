import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let header = TestUtils.renderIntoDocument(
      <Header changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(header, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let header = TestUtils.renderIntoDocument(
      <Header changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(header.state.activeFilter).toBe('exists')
    header.handleSelectChange('activeFilter')('foo')
    expect(header.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
