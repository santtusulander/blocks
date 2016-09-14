import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache.jsx')
const Cache = require('../cache.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Cache', () => {
  it('should exist', () => {
    let cache = TestUtils.renderIntoDocument(
      <Cache set={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(TestUtils.isCompositeComponent(cache)).toBeTruthy();
  })

  it('should update the state as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <Cache changeValue={changeValue} set={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cache, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(cache.state.maxAge).toEqual('new')
  })

  it('should save changes', () => {
    const changeValue = jest.genMockFunction()
    const close = jest.genMockFunction()
    const expectedSave = Immutable.fromJS({
      cases: [[ "foo" ]],
      check_etag: 'aaa',
      honor_origin: 'bbb',
      max_age: 123,
      no_store: 'ddd'
    })
    let cache = TestUtils.renderIntoDocument(
      <Cache changeValue={changeValue} set={fakeConfig} path={fakePath}
        close={close} intl={intlMaker()}/>
    )
    cache.setState({
      checkEtag: 'aaa',
      honorOrigin: 'bbb',
      maxAge: '123',
      noStore: 'ddd'
    })
    cache.saveChanges()
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar'])
    expect(Immutable.is(changeValue.mock.calls[0][1], expectedSave)).toBeTruthy()
    expect(close.mock.calls.length).toBe(1)
  })
})
