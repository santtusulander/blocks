import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../edit-group.jsx')
const EditGroup = require('../edit-group.jsx')

describe('EditGroup', () => {
  it('should exist', () => {
    let editGroup = TestUtils.renderIntoDocument(
      <EditGroup group={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(editGroup)).toBeTruthy();
  })
  it('should save changes', () => {
    let saveChanges = jest.genMockFunction()
    let editGroup = TestUtils.renderIntoDocument(
      <EditGroup group={Immutable.Map()} saveChanges={saveChanges}/>
    )
    let form = TestUtils.findRenderedDOMComponentWithTag(editGroup, 'form')
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
  it('should update the group as changes happen', () => {
    let changeValue = jest.genMockFunction()
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
