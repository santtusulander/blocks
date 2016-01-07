import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../account.jsx')
const Account = require('../account.jsx')

describe('Account', () => {
  it('should exist', () => {
    let account = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Account account={Immutable.Map()}/>
        </tbody>
      </table>
    );
    let tr = account.getElementsByTagName('tr')
    expect(tr.length).toEqual(1);
  })
  it('should delete', () => {
    let deleteFunc = jest.genMockFunction()
    let deleteAccount = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Account account={Immutable.Map()} delete={deleteFunc}/>
        </tbody>
      </table>
    )
    let links = deleteAccount.getElementsByTagName('a')
    TestUtils.Simulate.click(links[0])
    expect(deleteFunc.mock.calls.length).toEqual(1)
  })
  it('should toggle active', () => {
    let toggleActive = jest.genMockFunction()
    let account = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Account account={Immutable.Map()} toggleActive={toggleActive}/>
        </tbody>
      </table>
    )
    let tr = account.getElementsByTagName('tr')
    TestUtils.Simulate.click(tr[0])
    expect(toggleActive.mock.calls.length).toEqual(1)
  })
})
