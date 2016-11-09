import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../policies.jsx')
import ConfigurationPolicies from '../policies.jsx'
import ConfigurationSidebar from '../sidebar.jsx'

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
            "origin_host_port": 3333
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52",
            "deployment_status": 1
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

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}


describe('ConfigurationPolicies', () => {
  it('should exist', () => {
    const policies = shallow(<ConfigurationPolicies intl={intlMaker()}/>)
    expect(policies).toBeDefined()
  })

  it('should change values', () => {
    const changeValue = jest.fn()
    const policies = shallow(<ConfigurationPolicies changeValue={changeValue}
      config={fakeConfig} intl={intlMaker()}/>)
    policies.instance().handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });

  it('should change active rule', () => {
    const activateRule = jest.fn()
    const policies = shallow(
      <ConfigurationPolicies config={fakeConfig} intl={intlMaker()}
        activateRule={activateRule} activeRule={Immutable.List()}/>
    )
    policies.instance().changeActiveRuleType('request')
    expect(activateRule.mock.calls[0][0].get(0)).toEqual('request_policy')
    policies.instance().changeActiveRuleType('response')
    expect(activateRule.mock.calls[1][0].get(0)).toEqual('response_policy')
  })

  it('should show sidebar when a rule is active', () => {
    const policies = shallow(
      <ConfigurationPolicies config={fakeConfig}
        activeRule={Immutable.List([0])}
        intl={intlMaker()}/>
    )
    const sidebar = policies.find(ConfigurationSidebar)
    expect(sidebar.length).toBe(1)
  })

  it('should not show a sidebar when a rule is not active', () => {
    const policies = shallow(
      <ConfigurationPolicies config={fakeConfig} activeRule={null}
        intl={intlMaker()}/>
    )
    const sidebar = policies.find(ConfigurationSidebar)
    expect(sidebar.length).toBe(0)
  })
})
