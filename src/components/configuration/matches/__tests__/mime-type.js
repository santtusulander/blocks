import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../mime-type.jsx')
const MimeType = require('../mime-type.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('MimeType', () => {
  it('should exist', () => {
    let mimeType = TestUtils.renderIntoDocument(
      <MimeType match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(mimeType)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let mimeType = TestUtils.renderIntoDocument(
      <MimeType changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(mimeType, 'textarea')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let mimeType = TestUtils.renderIntoDocument(
      <MimeType changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(mimeType.state.activeFilter).toBe('matches')
    mimeType.handleSelectChange('activeFilter')('foo')
    expect(mimeType.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
