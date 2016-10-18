import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow }  from 'enzyme'

jest.disableAutomock() // Uses react-bootstrap extensively, so don't auto mock
jest.unmock('../../util/status-codes')

import Configuration from '../configuration'
import ConfigurationDetails from '../../components/configuration/details'
import ConfigurationDefaults from '../../components/configuration/defaults'
import ConfigurationPolicies from '../../components/configuration/policies'
import ConfigurationPerformance from '../../components/configuration/performance'
import ConfigurationSecurity from '../../components/configuration/security'
import ConfigurationCertificates from '../../components/configuration/certificates'
import ConfigurationChangeLog from '../../components/configuration/change-log'

function hostActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchHost: jest.fn(),
    updateHost: jest.fn().mockImplementation(() => {
      return {then: cb => cb({payload: {}})}
    }),
    changeActiveHost: jest.fn(),
    deleteConfiguration: jest.fn()
  }
}

function uiActionsMaker() {
  return {
    changeNotification: jest.fn()
  }
}

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn()
  }
}

function groupActionsMaker() {
  return {
    fetchGroup: jest.fn()
  }
}

function securityActionsMaker() {
  return {
    fetchSSLCertificates: jest.fn()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', property: 'www.abc.com', version: '1'}

const fakeLocation = {query: {name: 'www.abc.com'}}

const fakeHost = Immutable.fromJS({
  "status": 1,
  "updated": 1453422142.746901,
  "db_id": 6,
  "account_id": "1",
  "request_mode": "update_published_host",
  "db_type": "redis",
  "created": null,
  "brand_id": "udn",
  "published_host_id": "aaaaa",
  "services": [
    {
      "updated": 1453422142.746678,
      "description": "",
      "end_date": "2017-01-21 19:22:22.745982",
      "created": 1453422142.746019,
      "object_id": "34c68a0c-c09e-11e5-bba1-04012bb11c01",
      "summary": {
        "status": "",
        "published_name": "",
        "last_editor": ""
      },
      "service_type": "media",
      "__cs_service__": "Cloud Scale Service object",
      "start_date": "2016-01-21 19:22:22.745982",
      "configurations": [
        {
          "config_id": "1",
          "request_policy": {"policy_rules": [
            {
              "match": {
                "default": [
                  {
                    "set": {
                      "cache_control": {
                        "no-store": true
                      }
                    }
                  }
                ],
                "field": "request_path",
                "cases": [
                  [
                    "/videos/(.*)\\.mp4",
                    [
                      {
                        "set": {
                          "cache_name": {
                            "name": [
                              {
                                "field": "text",
                                "field_detail": "content/"
                              },
                              {
                                "field": "request_query_arg",
                                "field_detail": "itag"
                              },
                              {
                                "field": "text",
                                "field_detail": "/"
                              },
                              {
                                "field": "group",
                                "field_detail": "1"
                              }
                            ]
                          }
                        }
                      }
                    ]
                  ],
                  [
                    "(.*)\\.m3u8",
                    [
                      {
                        "set": {
                          "cache_control": {
                            "max-age": 10
                          }
                        }
                      }
                    ]
                  ]
                ]
              }
            },
            {
              "match": {
                "field": "request_cookie",
                "cases": [
                  [
                    "mobile",
                    [
                      {
                        "set": {
                          "header": {
                            "action": "set",
                            "header": "X-optimize",
                            "value": "yes"
                          }
                        }
                      }
                    ]
                  ]
                ],
                "field_detail": "client_type"
              }
            }
          ]},
          "edge_configuration": {
            "published_name": "examplffffffe.com",
            "origin_host_name": "sdrgfdg.com",
            "origin_host_port": 3333
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52",
            "deployment_status": 2
          },
          "default_policy": {"policy_rules": [
            {
              "set": {
                "cache_control": {
                  "honor_origin": true,
                  "check_etag": "weak",
                  "max_age": 0
                }
              }
            },
            {
              "set": {
                "cache_name": {
                  "ignore_case": false
                }
              }
            }
          ]},
          "response_policy": {"policy_rules": [
            {
              "match": {
                "field": "response_code",
                "cases": [
                  [
                    "307",
                    [
                      {
                        "match": {
                          "field": "response_header",
                          "cases": [
                            [
                              "origin1.example.com/(.*)",
                              [
                                {
                                  "set": {
                                    "header": {
                                      "action": "set",
                                      "header": "Location",
                                      "value": [
                                        {
                                          "field": "text",
                                          "field_detail": "origin2.example.com/"
                                        },
                                        {
                                          "field": "group",
                                          "field_detail": "1"
                                        }
                                      ]
                                    }
                                  }
                                }
                              ]
                            ]
                          ],
                          "field_detail": "Location"
                        }
                      }
                    ]
                  ]
                ]
              }
            }
          ]}
        }
      ]
    }
  ],
  "group_id": "4",
  "config_file_version": 1,
  "description": ""
})

describe('Configuration', () => {
  it('should exist', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    expect(TestUtils.isCompositeComponent(config)).toBeTruthy();
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    shallow(
      <Configuration hostActions={hostActions} fetching={true}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        params={urlParams} location={fakeLocation}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });

  it('should initially render details subcomponent', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(1);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render defaults subcomponent when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'defaults'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(1);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render policies subcomponent when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        uiActions={uiActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'policies'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(1);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render performance subcomponent when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'performance'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(1);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render security subcomponent when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'security'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(1);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render certificates subcomponent when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'certificates'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(1);
		expect(changelog.length).toEqual(0);
  })

  it('should render change-log change log when tab is clicked', () => {
    let config = shallow(
      <Configuration hostActions={hostActionsMaker()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.setState({activeTab: 'change-log'})

    let details = config.find(ConfigurationDetails);
    let defaults = config.find(ConfigurationDefaults);
    let policies = config.find(ConfigurationPolicies);
    let performance = config.find(ConfigurationPerformance);
    let security = config.find(ConfigurationSecurity);
    let certs = config.find(ConfigurationCertificates);
    let changelog = config.find(ConfigurationChangeLog);
		expect(details.length).toEqual(0);
		expect(defaults.length).toEqual(0);
		expect(policies.length).toEqual(0);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(1);
  })

  it('should make changes to the host', () => {
    const hostActions = hostActionsMaker()
    let config = shallow(
      <Configuration hostActions={hostActions}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.instance().changeValue(['edge_configuration', 'origin_host_name'], 'new value')
    expect(hostActions.changeActiveHost.mock.calls[0][0].toJS()).toEqual(
      fakeHost.setIn(
        ['services', 0, 'configurations', 0, 'edge_configuration', 'origin_host_name'],
        'new value').toJS()
    )
  })

  it('should save changes to the host', () => {
    const hostActions = hostActionsMaker()
    const uiActions = uiActionsMaker()
    let config = shallow(
      <Configuration hostActions={hostActions}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}
        uiActions={uiActions}/>
    );
    config.instance().saveActiveHostChanges()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toEqual('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4]).toEqual(fakeHost.toJS())
  })

  it('should add a version', () => {
    const hostActions = hostActionsMaker()
    let config = shallow(
      <Configuration hostActions={hostActions}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}/>
    );
    config.instance().cloneActiveVersion()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toBe('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4].services[0].configurations.length).toBe(2)
  })

  it("should change a version's deployment_status", () => {
    const hostActions = hostActionsMaker()
    const uiActions = uiActionsMaker()
    let config = shallow(
      <Configuration hostActions={hostActions}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}
        uiActions={uiActions}/>
    );
    config.instance().togglePublishModal = jest.fn()
    config.instance().changeActiveVersionEnvironment(2)
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toBe('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4].services[0].configurations[0]
      .configuration_status.deployment_status).toBe(2)
    expect(config.instance().togglePublishModal.mock.calls.length).toBe(1)
  })

  /* Not in 1.0
  it("should not show publish modal if version is retired", () => {
    const hostActions = hostActionsMaker()
    const uiActions = uiActionsMaker()
    let config = shallow(
      <Configuration hostActions={hostActions}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        activeHost={fakeHost}
        params={urlParams} location={fakeLocation}
        uiActions={uiActions}/>
    );
    config.instance().togglePublishModal = jest.fn()
    config.instance().changeActiveVersionEnvironment(1)
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toBe('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4].services[0].configurations[0]
      .configuration_status.deployment_status).toBe(1)
    expect(config.instance().togglePublishModal.mock.calls.length).toBe(0)
  })
  */
})
