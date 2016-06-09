import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff()
jest.dontMock('../groups.jsx')
const Groups = require('../groups.jsx').Groups
const ContentItemChart = require('../../components/content/content-item-chart.jsx')
const ContentItemList = require('../../components/content/content-item-list.jsx')

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
function accountActionsMaker() {
  return {
    fetchAccount: jest.genMockFunction()
  }
}
function metricsActionsMaker() {
  return {
    fetchGroupMetrics: jest.genMockFunction(),
    startGroupFetching: jest.genMockFunction()
  }
}

const fakeGroups = Immutable.fromJS([
  {id: '1', name: 'aaa'},
  {id: '2', name: 'bbb'}
])

const fakeMetrics = Immutable.fromJS([
  {
    group: '1',
    avg_cache_hit_rate: 1,
    historical_traffic: [],
    historical_variance: [],
    traffic: [],
    transfer_rates: {
      peak: '3 Unit',
      average: '2 Unit',
      lowest: '1 Unit'
    }
  },
  {
    group: '2',
    avg_cache_hit_rate: 2,
    historical_traffic: [],
    historical_variance: [],
    traffic: [],
    transfer_rates: {
      peak: '6 Unit',
      average: '5 Unit',
      lowest: '4 Unit'
    }
  }
])

const urlParams = {brand: 'udn', account: '1'}

describe('Groups', () => {
  it('should exist', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(groups)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const fetchData = jest.genMockFunction()
    TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={fetchData}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(fetchData.mock.calls.length).toBe(1)
  });

  it('should show a loading message', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(groups, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
  });

  it('should show existing groups as charts', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        groups={fakeGroups}
        metrics={fakeMetrics}
        params={urlParams}
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(groups, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe('1')
  });

  it('should show existing groups as lists', () => {
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        groups={fakeGroups}
        metrics={fakeMetrics}
        params={urlParams}
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(groups, ContentItemList)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe('1')
  });
  // Not in 0.5
  // it('should activate a group for edit when clicked', () => {
  //   const groupActions = groupActionsMaker()
  //   let groups = TestUtils.renderIntoDocument(
  //     <Groups groupActions={groupActions}
  //       uiActions={uiActionsMaker()}
  //       fetchData={jest.genMockFunction()}
  //       groups={fakeGroups}
  //       params={urlParams}/>
  //   )
  //   groups.toggleActiveGroup(1)()
  //   expect(groupActions.fetchGroup.mock.calls[0]).toEqual(['udn',1,1])
  // });
  //
  // it('should deactivate a group when clicked if already active', () => {
  //   const groupActions = groupActionsMaker()
  //   let groups = TestUtils.renderIntoDocument(
  //     <Groups groupActions={groupActions}
  //       uiActions={uiActionsMaker()}
  //       fetchData={jest.genMockFunction()}
  //       groups={fakeGroups}
  //       activeGroup={Immutable.Map({id:1})}
  //       params={urlParams}/>
  //   )
  //   groups.toggleActiveGroup(1)()
  //   expect(groupActions.changeActiveGroup.mock.calls[0][0]).toBe(null)
  // });
  //
  // it('should be able to change the active group', () => {
  //   const groupActions = groupActionsMaker()
  //   let groups = TestUtils.renderIntoDocument(
  //     <Groups groupActions={groupActions}
  //       uiActions={uiActionsMaker()}
  //       fetchData={jest.genMockFunction()}
  //       groups={fakeGroups}
  //       activeGroup={Immutable.Map({id: 1, name: 'aaa'})}
  //       params={urlParams}/>
  //   )
  //   groups.changeActiveGroupValue(['name'], 'bbb')
  //   expect(groupActions.changeActiveGroup.mock.calls[0][0].toJS()).toEqual({
  //     id: 1,
  //     name: 'bbb'
  //   })
  // })
  //
  // it('should be able save updates to the active group', () => {
  //   const groupActions = groupActionsMaker()
  //   let groups = TestUtils.renderIntoDocument(
  //     <Groups groupActions={groupActions}
  //       uiActions={uiActionsMaker()}
  //       fetchData={jest.genMockFunction()}
  //       groups={fakeGroups}
  //       activeGroup={Immutable.Map({id: 1, name: 'aaa'})}
  //       params={urlParams}/>
  //   )
  //   groups.saveActiveGroupChanges()
  //   expect(groupActions.updateGroup.mock.calls[0][3]).toEqual({
  //     name: 'aaa'
  //   })
  // })

  it('should delete a group when clicked', () => {
    const groupActions = groupActionsMaker()
    let groups = TestUtils.renderIntoDocument(
      <Groups groupActions={groupActions}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        groups={fakeGroups}
        metrics={fakeMetrics}
        params={urlParams}/>
    )
    groups.deleteGroup('1')
    expect(groupActions.deleteGroup.mock.calls[0]).toEqual(['udn','1','1'])
  })
})
