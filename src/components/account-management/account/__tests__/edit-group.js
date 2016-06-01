import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../edit-group.jsx')
const EditGroup = require('../edit-group.jsx')

describe('AccountManagementAccountEditGroup', () => {
  it('should exist', () => {
    const editGroup = TestUtils.renderIntoDocument(
      <EditGroup />
    )
    expect(TestUtils.isCompositeComponent(editGroup)).toBeTruthy()
  })
  it('should save an edited group', () => {
    const save = jest.genMockFunction()
    const editGroup = TestUtils.renderIntoDocument(
      <EditGroup name="aaa" save={save}/>
    )
    editGroup.save({stopPropagation: jest.genMockFunction()})
    expect(save.mock.calls[0][0]).toBe('aaa')
  })
})
