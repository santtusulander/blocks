import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff()
jest.dontMock('../hosts.jsx')
const Hosts = require('../hosts.jsx').Hosts
const ContentItemChart = require('../../components/content-item-chart.jsx')
const ContentItemList = require('../../components/content-item-list.jsx')

function hostActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchHosts: jest.genMockFunction(),
    createHost: jest.genMockFunction(),
    deleteHost: jest.genMockFunction()
  }
}
function uiActionsMaker() {
  return {
    toggleChartView: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '1'}

describe('Hosts', () => {
  it('should exist', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetching={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(hosts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} uiActions={uiActionsMaker()}
        fetching={true} params={urlParams}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHosts.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHosts.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHosts.mock.calls[0][2]).toBe('1')
  });

  it('should show a loading message', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetching={true} params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(hosts, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
  });

  it('should show existing hosts as charts', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()}
        uiActions={uiActionsMaker()}
        hosts={Immutable.List([1,2])}
        params={urlParams}
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should show existing hosts as lists', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        hosts={Immutable.List([1,2])}
        params={urlParams}
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemList)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should add a new host when called', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} uiActions={uiActionsMaker()}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.createNewHost('bbb')
    expect(hostActions.createHost.mock.calls[0]).toEqual(['udn','1','1','bbb'])
  })

  it('should delete a host when clicked', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} uiActions={uiActionsMaker()}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.deleteHost('aaa')
    expect(hostActions.deleteHost.mock.calls[0]).toEqual(['udn','1','1','aaa'])
  })
})
