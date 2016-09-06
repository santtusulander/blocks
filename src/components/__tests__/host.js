import React from 'react'
import TestUtils from 'react-addons-test-utils'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../host.jsx')
const Host = require('../host.jsx')

describe('Host', () => {
  it('should exist', () => {
    let host = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Host/>
        </tbody>
      </table>
    );
    let tr = host.getElementsByTagName('tr')
    expect(tr.length).toEqual(1);
  })
  it('should delete', () => {
    let deleteFunc = jest.genMockFunction()
    let deleteHost = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Host delete={deleteFunc}/>
        </tbody>
      </table>
    )
    let links = deleteHost.getElementsByTagName('a')
    TestUtils.Simulate.click(links[1])
    expect(deleteFunc.mock.calls.length).toEqual(1)
  })
})
