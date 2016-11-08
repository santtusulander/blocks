import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../edit-account.jsx')
import EditAccount from '../edit-account.jsx'

describe('EditAccount', () => {
  it('should exist', () => {
    let editAccount = TestUtils.renderIntoDocument(
      <EditAccount account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(editAccount)).toBeTruthy();
  })
  it('should save changes', () => {
    let saveChanges = jest.fn()
    let editAccount = TestUtils.renderIntoDocument(
      <EditAccount account={Immutable.Map()} saveChanges={saveChanges}/>
    )
    let form = TestUtils.findRenderedDOMComponentWithTag(editAccount, 'form')
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
  it('should update the account as changes happen', () => {
    let changeValue = jest.fn()
    let editAccount = TestUtils.renderIntoDocument(
      <EditAccount account={Immutable.Map()} changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(editAccount, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
