import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../groups.jsx')
const Groups = require('../groups.jsx')
const EditGroup = require('../edit-group.jsx')

const fakeGroups = Immutable.fromJS([
  {id: 1, name: 'aaa', created: new Date().getTime()},
  {id: 2, name: 'ccc', created: new Date().getTime()  + 1},
  {id: 3, name: 'bbb', created: new Date().getTime()  - 1}
])

describe('AccountManagementAccountGroups', () => {
  it('should exist', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups />
    )
    expect(TestUtils.isCompositeComponent(groups)).toBeTruthy()
  })
  it('should show groups', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups}/>
    )
    expect(TestUtils.scryRenderedDOMComponentsWithTag(groups, 'tr').length).toBe(4)
  })
  it('should sort groups by name', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups}/>
    )
    expect(TestUtils.scryRenderedDOMComponentsWithTag(groups, 'td')[0].textContent).toContain('aaa')
    groups.changeSort('name', -1)
    expect(TestUtils.scryRenderedDOMComponentsWithTag(groups, 'td')[0].textContent).toContain('ccc')
  })
  it('should sort groups by date', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups}/>
    )
    expect(TestUtils.scryRenderedDOMComponentsWithTag(groups, 'td')[0].textContent).toContain('aaa')
    groups.changeSort('created', -1)
    expect(TestUtils.scryRenderedDOMComponentsWithTag(groups, 'td')[0].textContent).toContain('ccc')
  })
  it('should show a row for adding a group', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups}/>
    )
    expect(TestUtils.scryRenderedComponentsWithType(groups, EditGroup).length).toBe(0)
    groups.addGroup({stopPropagation: jest.genMockFunction()})
    expect(TestUtils.scryRenderedComponentsWithType(groups, EditGroup).length).toBe(1)
  })
  it('should save an added group', () => {
    const addGroup = jest.genMockFunction().mockReturnValue({
        then: (cb => cb())
      })
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups} addGroup={addGroup}/>
    )
    groups.saveNewGroup('zzz')
    expect(addGroup.mock.calls[0][0]).toBe('zzz')
  })
  it('should show a row for editing a group', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups}/>
    )
    expect(TestUtils.scryRenderedComponentsWithType(groups, EditGroup).length).toBe(0)
    groups.editGroup(1)({
      stopPropagation: jest.genMockFunction(),
      preventDefault: jest.genMockFunction()
    })
    expect(TestUtils.scryRenderedComponentsWithType(groups, EditGroup).length).toBe(1)
  })
  it('should save an edited group', () => {
    const editGroup = jest.genMockFunction().mockReturnValue({
        then: (cb => cb())
      })
    const groups = TestUtils.renderIntoDocument(
      <Groups groups={fakeGroups} editGroup={editGroup}/>
    )
    groups.saveEditedGroup(1)('zzz')
    expect(editGroup.mock.calls[0][0]).toBe(1)
    expect(editGroup.mock.calls[0][1]).toBe('zzz')
  })
})
