import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../directory-path.jsx')
const DirectoryPath = require('../directory-path.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('DirectoryPath', () => {
  it('should exist', () => {
    let directoryPath = TestUtils.renderIntoDocument(
      <DirectoryPath match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(directoryPath)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let directoryPath = TestUtils.renderIntoDocument(
      <DirectoryPath changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(directoryPath, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let directoryPath = TestUtils.renderIntoDocument(
      <DirectoryPath changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(directoryPath.state.activeFilter).toBe('matches')
    directoryPath.handleSelectChange('activeFilter')('foo')
    expect(directoryPath.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
