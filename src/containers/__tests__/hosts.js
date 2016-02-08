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

const urlParams = {brand: 'udn', account: '1', group: '1'}

describe('Hosts', () => {
  it('should exist', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(hosts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} fetching={true}
        params={urlParams}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHosts.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHosts.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHosts.mock.calls[0][2]).toBe('1')
  });

  it('should show a loading message', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} fetching={true}
        params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(hosts, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
  });

  it('should show existing hosts as charts', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()}
        hosts={Immutable.List([1,2])}
        params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(hosts, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).not.toContain('Loading...')
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should show existing hosts as lists', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()}
        hosts={Immutable.List([1,2])}
        params={urlParams}/>
    )
    let btn = TestUtils.scryRenderedDOMComponentsWithClass(hosts, 'toggle-view')
    TestUtils.Simulate.click(btn[1])
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemList)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe(1)
  });

  it('should add a new host when called', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.createNewHost('bbb')
    expect(hostActions.createHost.mock.calls[0]).toEqual(['udn','1','1','bbb'])
  })

  it('should delete a host when clicked', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.deleteHost('aaa')
    expect(hostActions.deleteHost.mock.calls[0]).toEqual(['udn','1','1','aaa'])
  })
})
