import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../hosts.jsx')
jest.dontMock('../../components/host.jsx')
const Hosts = require('../hosts.jsx').Hosts
const Host = require('../../components/host.jsx')

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
    let tbody = TestUtils.findRenderedDOMComponentWithTag(hosts, 'tbody')
    expect(ReactDOM.findDOMNode(tbody).textContent).toContain('Loading...')
  });

  it('should show existing hosts', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()}
        hosts={Immutable.List(['aaa'])}
        params={urlParams}/>
    )
    let child = TestUtils.findRenderedComponentWithType(hosts, Host);
		expect(child.props.id).toEqual("aaa");
		expect(child.props.name).toEqual("Name");
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
