import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff()
jest.dontMock('../groups.jsx')
const Groups = require('../groups.jsx').Groups
const ContentItemChart = require('../../components/content-item-chart.jsx')
const ContentItemList = require('../../components/content-item-list.jsx')

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
function uiActionsMaker() {
  return {
    toggleChartView: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: 1}

describe('Groups', () => {
  it('should exist', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(groups)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const groupActions = groupActionsMaker()
    TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    expect(groupActions.startFetching.mock.calls.length).toBe(1)
    expect(groupActions.fetchGroups.mock.calls[0][0]).toBe('udn')
  });

  it('should show a loading message', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
  });

  it('should show existing groups as charts', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        groups={Immutable.List([1,2])}
        params={urlParams}
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(groups, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should show existing groups as lists', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        groups={Immutable.List([1,2])}
        params={urlParams}
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(groups, ContentItemList)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should activate a group for edit when clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()}
        groups={Immutable.List([1])}
        params={urlParams}/>
    )
    groups.toggleActiveGroup(1)()
    expect(groupActions.fetchGroup.mock.calls[0]).toEqual(['udn',1,1])
  });

  it('should deactivate a group when clicked if already active', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()}
        groups={Immutable.List([1])}
        activeGroup={Immutable.Map({group_id:1})}
        params={urlParams}/>
    )
    groups.toggleActiveGroup(1)()
    expect(groupActions.changeActiveGroup.mock.calls[0][0]).toBe(null)
  });

  it('should be able to change the active group', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()}
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
        uiActions={uiActionsMaker()}
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

  it('should delete a group when clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()}
        groups={Immutable.List([1])}
        params={urlParams}/>
    )
    groups.deleteGroup(1)
    expect(groupActions.deleteGroup.mock.calls[0]).toEqual(['udn',1,1])
  })
})
