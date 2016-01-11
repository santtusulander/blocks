import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

const Configuration = require('../configuration.jsx').Configuration
const ConfigurationDetails = require('../../components/configuration/details')
const ConfigurationCache = require('../../components/configuration/cache')
const ConfigurationPerformance = require('../../components/configuration/performance')
const ConfigurationSecurity = require('../../components/configuration/security')
const ConfigurationCertificates = require('../../components/configuration/certificates')
const ConfigurationChangeLog = require('../../components/configuration/change-log')

function hostActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchHost: jest.genMockFunction(),
    updateHost: jest.genMockFunction(),
    changeActiveHost: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', version: '3'}

describe('Configuration', () => {
  it('should exist', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        params={urlParams}/>
    );
    expect(TestUtils.isCompositeComponent(config)).toBeTruthy();
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActions} fetching={true}
        params={urlParams}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });

  it('should initially render details subcomponent', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(1);
		expect(cache.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render cache subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[1]);

    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(cache.length).toEqual(1);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render performance subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[2]);

    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(cache.length).toEqual(0);
		expect(performance.length).toEqual(1);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render security subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[3]);

    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(cache.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(1);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render certificates subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[4]);

    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(cache.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(1);
		expect(changelog.length).toEqual(0);
  })

  it('should render performance change log when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[5]);

    let details = TestUtils.scryRenderedComponentsWithType(config, ConfigurationDetails);
    let cache = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCache);
    let performance = TestUtils.scryRenderedComponentsWithType(config, ConfigurationPerformance);
    let security = TestUtils.scryRenderedComponentsWithType(config, ConfigurationSecurity);
    let certs = TestUtils.scryRenderedComponentsWithType(config, ConfigurationCertificates);
    let changelog = TestUtils.scryRenderedComponentsWithType(config, ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(cache.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(1);
  })

  it('should make changes to the host', () => {
    const hostActions = hostActionsMaker()
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActions}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    config.changeValue(['fake'], false)
    expect(hostActions.changeActiveHost.mock.calls[0][0].toJS()).toEqual(
      {fake: false}
    )
  })

  it('should save changes to the host', () => {
    const hostActions = hostActionsMaker()
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActions}
        activeHost={Immutable.Map({fake: true})}
        params={urlParams}/>
    );
    config.saveActiveHostChanges()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toEqual({fake: true})
  })
})
