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
    changeActiveHost: jest.genMockFunction(),
    deleteConfiguration: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', version: '1'}

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
          "request_policies": [
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
          ],
          "edge_configuration": {
            "published_name": "examplffffffe.com",
            "origin_host_name": "sdrgfdg.com",
            "origin_host_port": "3333"
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52"
          },
          "default_policies": [
            {
              "set": {
                "cache_control": {
                  "honor_origin": true,
                  "check_etag": "weak"
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
          ],
          "response_policies": [
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
          ]
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
        activeHost={fakeHost}
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
        activeHost={fakeHost}
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
		expect(cache.length).toEqual(1);
		expect(performance.length).toEqual(0);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render performance subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={fakeHost}
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
		expect(performance.length).toEqual(1);
		expect(security.length).toEqual(0);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render security subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={fakeHost}
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
		expect(security.length).toEqual(1);
		expect(certs.length).toEqual(0);
		expect(changelog.length).toEqual(0);
  })

  it('should render certificates subcomponent when tab is clicked', () => {
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActionsMaker()}
        activeHost={fakeHost}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[6]);

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
        activeHost={fakeHost}
        params={urlParams}/>
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(config, 'a');
    TestUtils.Simulate.click(links[7]);

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
        activeHost={fakeHost}
        params={urlParams}/>
    );
    config.changeValue(['edge_configuration', 'origin_host_name'], 'new value')
    expect(hostActions.changeActiveHost.mock.calls[0][0].toJS()).toEqual(
      fakeHost.setIn(
        ['services', 0, 'configurations', 0, 'edge_configuration', 'origin_host_name'],
        'new value').toJS()
    )
  })

  it('should save changes to the host', () => {
    const hostActions = hostActionsMaker()
    let config = TestUtils.renderIntoDocument(
      <Configuration hostActions={hostActions}
        activeHost={fakeHost}
        params={urlParams}/>
    );
    config.saveActiveHostChanges()
    expect(hostActions.updateHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.updateHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.updateHost.mock.calls[0][2]).toBe('2')
    expect(hostActions.updateHost.mock.calls[0][3]).toEqual(fakeHost.toJS())
  })
})
