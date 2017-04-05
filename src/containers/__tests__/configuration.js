import React from 'react'
import Immutable from 'immutable'
import { shallow }  from 'enzyme'

import MockedChild from '../../components/configuration/defaults'

jest.disableAutomock() // Uses react-bootstrap extensively, so don't auto mock
jest.unmock('../../util/status-codes')
jest.unmock('../configuration.jsx')
import { Configuration } from '../configuration.jsx'

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
          "defaults": {
            "cache_control_max_age": null,
            "cache_key_query": null,
            "cache_control_check_etag": "false",
            "response_remove_vary": true,
            "cache_control_honor_origin": false,
            "cache_name_ignore_case": true
          },
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

/**
 *
 * No need to test tab-changing functionality, since react-router handles it.
 */

let config = null
let hostActions = null
let uiActions = null
describe('Configuration', () => {
  beforeEach(() => {
    hostActions = hostActionsMaker()
    uiActions = uiActionsMaker()
    config = shallow(
      <Configuration
        intl={{formatMessage() {}}}
        hostActions={hostActions}
        currentUser={new Immutable.Map()}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        securityActions={securityActionsMaker()}
        fetchStorage={() => Promise.resolve()}
        activeHost={fakeHost}
        params={urlParams}
        fetching={true}
        uiActions={uiActions}
        location={fakeLocation}>
        <MockedChild route={{ path: 'asd' }}/>
      </Configuration>
    );
  });

  it('should exist', () => {
    expect(config.length).toBe(1);
  });

  it('should request data on mount', () => {
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });

  it('should have a child component', () => {
    expect(config.find('ConfigurationDefaults').length).toBe(1)
  })

  it('should make changes to the host', () => {
    config.instance().changeValue(['edge_configuration', 'origin_host_name'], 'new value')
    expect(hostActions.changeActiveHost.mock.calls[0][0].toJS()).toEqual(
      fakeHost.setIn(
        ['services', 0, 'configurations', 0, 'edge_configuration', 'origin_host_name'],
        'new value').toJS()
    )
  })

  it('should save changes to the host', () => {
    config.instance().saveActiveHostChanges()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toEqual('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4]).toEqual(fakeHost.toJS())
  })

  it('should add a version', () => {
    config.instance().cloneActiveVersion()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toBe('www.abc.com')
    expect(hostActions.updateHost.mock.calls[0][4].services[0].configurations.length).toBe(2)
  })

  it("should change a version's deployment_status", () => {
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
