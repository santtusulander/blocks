import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../groups.jsx')
const Groups = require('../groups.jsx').Groups

function groupActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchGroups: jest.genMockFunction(),
    fetchGroup: jest.genMockFunction(),
    changeActiveGroup: jest.genMockFunction(),
    updateGroup: jest.genMockFunction(),
    createGroup: jest.genMockFunction(),
    deleteGroup: jest.genMockFunction()
  }
}

const urlParams = {account: 1}

describe('Groups', () => {
  it('should exist', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(groups)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const groupActions = groupActionsMaker()
    TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions} fetching={true}
        params={urlParams}/>
    )
    expect(groupActions.startFetching.mock.calls.length).toBe(1)
    expect(groupActions.fetchGroups.mock.calls[0][0]).toBe('udn')
  });

  it('should show a loading message', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    let tbody = TestUtils.findRenderedDOMComponentWithTag(groups, 'tbody')
    expect(ReactDOM.findDOMNode(tbody).textContent).toContain('Loading...')
  });

  it('should show existing groups', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        groups={Immutable.List([1,2])}
        params={urlParams}/>
    )
    let tbody = TestUtils.findRenderedDOMComponentWithTag(groups, 'tbody')
    expect(ReactDOM.findDOMNode(tbody).textContent).not.toContain('Loading...')
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'tr')
    expect(trs.length).toBe(3)
    expect(ReactDOM.findDOMNode(trs[1]).textContent).toContain('1')
  });

  it('should activate a group for edit when clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List([1])}
        params={urlParams}/>
    )
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'tr')
    TestUtils.Simulate.click(trs[1])
    expect(groupActions.fetchGroup.mock.calls[0]).toEqual(['udn',1,1])
  });

  it('should deactivate a group when clicked if already active', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List([1])}
        activeGroup={Immutable.Map({group_id:1})}
        params={urlParams}/>
    )
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'tr')
    TestUtils.Simulate.click(trs[1])
    expect(groupActions.changeActiveGroup.mock.calls[0][0]).toBe(null)
  });

  it('should be able to change the active group', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List([1])}
        activeGroup={Immutable.Map({group_id: 1, name: 'aaa'})}
        params={urlParams}/>
    )
    groups.changeActiveGroupValue(['name'], 'bbb')
    expect(groupActions.changeActiveGroup.mock.calls[0][0].toJS()).toEqual({
      group_id: 1,
      name: 'bbb'
    })
  })

  it('should be able save updates to the active group', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List([1])}
        activeGroup={Immutable.Map({group_id: 1, name: 'aaa'})}
        params={urlParams}/>
    )
    groups.saveActiveGroupChanges()
    expect(groupActions.updateGroup.mock.calls[0][2]).toEqual({
      group_id: 1,
      name: 'aaa'
    })
  })

  it('should add a new group when button is clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List()}
        params={urlParams}/>
    )
    let add = TestUtils.findRenderedDOMComponentWithTag(groups, 'button')
    TestUtils.Simulate.click(add)
    expect(groupActions.createGroup.mock.calls.length).toBe(1)
  })

  it('should delete a group when clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        groups={Immutable.List([1])}
        params={urlParams}/>
    )
    let links = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'a')
    TestUtils.Simulate.click(links[0])
    expect(groupActions.deleteGroup.mock.calls[0]).toEqual(['udn',1,1])
  })
})
