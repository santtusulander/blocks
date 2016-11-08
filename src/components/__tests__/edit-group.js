import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../edit-group.jsx')
import EditGroup from '../edit-group.jsx'

describe('EditGroup', () => {
  it('should exist', () => {
    let editGroup = TestUtils.renderIntoDocument(
      <EditGroup group={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(editGroup)).toBeTruthy();
  })
  it('should save changes', () => {
    let saveChanges = jest.fn()
    let editGroup = TestUtils.renderIntoDocument(
      <EditGroup group={Immutable.Map()} saveChanges={saveChanges}/>
    )
    let form = TestUtils.findRenderedDOMComponentWithTag(editGroup, 'form')
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
  it('should update the group as changes happen', () => {
    let changeValue = jest.fn()
    let editGroup = TestUtils.renderIntoDocument(
      <EditGroup group={Immutable.Map()} changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(editGroup, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
