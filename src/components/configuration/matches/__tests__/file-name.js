import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-name.jsx')
const FileName = require('../file-name.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('FileName', () => {
  it('should exist', () => {
    let fileName = TestUtils.renderIntoDocument(
      <FileName match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(TestUtils.isCompositeComponent(fileName)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileName = TestUtils.renderIntoDocument(
      <FileName changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(fileName, 'textarea')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let fileName = TestUtils.renderIntoDocument(
      <FileName changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    expect(fileName.state.activeFilter).toBe('matches')
    fileName.handleSelectChange('activeFilter')('foo')
    expect(fileName.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
