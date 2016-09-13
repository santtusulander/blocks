import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

jest.dontMock('../file-extension.jsx')
const FileExtension = require('../file-extension.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('FileExtension', () => {
  it('should exist', () => {
    let fileExtension = TestUtils.renderIntoDocument(
      <FileExtension match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(TestUtils.isCompositeComponent(fileExtension)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileExtension = TestUtils.renderIntoDocument(
      <FileExtension changeValue={changeValue} match={fakeConfig}
        path={fakePath} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(fileExtension, 'textarea')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let fileExtension = TestUtils.renderIntoDocument(
      <FileExtension changeValue={changeValue} match={fakeConfig}
        path={fakePath} intl={intlMaker()}/>
    )
    expect(fileExtension.state.activeFilter).toBe('matches')
    fileExtension.handleSelectChange('activeFilter')('foo')
    expect(fileExtension.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
