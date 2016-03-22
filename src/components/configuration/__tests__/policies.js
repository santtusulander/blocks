import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../policies.jsx')
const ConfigurationPolicies = require('../policies.jsx')

const fakeConfig = Immutable.fromJS(
  {"status": 1,
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
            "origin_host_port": "3333"
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52",
            "environment": "staging"
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
  }
)

describe('ConfigurationPolicies', () => {
  it('should exist', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies />
    );
    expect(TestUtils.isCompositeComponent(policies)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies changeValue={changeValue}
        config={fakeConfig}/>
    );
    policies.handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });

  it('should clear active rule', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig} />
    );
    policies.activateRule([])
    policies.changeActiveRuleType('request')
    expect(policies.state.activeRulePath[0]).toBe('request_policy')
    policies.clearActiveRule()
    expect(policies.state.activeRulePath).toBe(null)
    policies.activateMatch(0)
    expect(policies.state.activeMatchPath).toBe(0)
    policies.clearActiveRule()
    expect(policies.state.activeMatchPath).toBe(null)
    policies.activateSet('some path')
    expect(policies.state.activeSetPath).toBe('some path')
    policies.clearActiveRule()
    expect(policies.state.activeSetPath).toBe(null)
  });

  it('should handle right column close', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig} />
    );
    policies.activateMatch(0)
    expect(policies.state.activeMatchPath).toBe(0)
    policies.handleRightColClose()
    expect(policies.state.activeMatchPath).toBe(null)
    policies.activateSet('some path')
    expect(policies.state.activeSetPath).toBe('some path')
    policies.handleRightColClose()
    expect(policies.state.activeSetPath).toBe(null)
  });

  it('should change active rule type', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig}/>
    );
    policies.activateRule([])
    policies.changeActiveRuleType('request')
    expect(policies.state.activeRulePath[0]).toBe('request_policy')
    policies.changeActiveRuleType('response')
    expect(policies.state.activeRulePath[0]).toBe('response_policy')
  });

  it('should activate rule', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig}/>
    );
    expect(policies.state.activeMatchPath).toBe(null)
    expect(policies.state.activeRulePath).toBe(null)
    expect(policies.state.activeSetPath).toBe(null)
    policies.activateRule('some path')
    expect(policies.state.activeMatchPath).toBe(null)
    expect(policies.state.activeRulePath).toBe('some path')
    expect(policies.state.activeSetPath).toBe(null)
  });

  it('should activate match', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig}/>
    );
    expect(policies.state.activeMatchPath).toBe(null)
    expect(policies.state.activeSetPath).toBe(null)
    policies.activateMatch(0)
    expect(policies.state.activeMatchPath).toBe(0)
    expect(policies.state.activeSetPath).toBe(null)
  });

  it('should activate set', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies config={fakeConfig}/>
    );
    expect(policies.state.activeMatchPath).toBe(null)
    expect(policies.state.activeSetPath).toBe(null)
    policies.activateSet('some path')
    expect(policies.state.activeMatchPath).toBe(null)
    expect(policies.state.activeSetPath).toBe('some path')
  });
})
