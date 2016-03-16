import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-name.jsx')
const FileName = require('../file-name.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('DirectoryPath', () => {
  it('should exist', () => {
    let fileName = TestUtils.renderIntoDocument(
      <FileName match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(fileName)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileName = TestUtils.renderIntoDocument(
      <FileName changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(fileName, 'textarea')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
