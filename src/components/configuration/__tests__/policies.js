import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../policies.jsx')
import ConfigurationPolicies from '../policies.jsx'
import ConfigurationSidebar from '../sidebar.jsx'
import { POLICY_TYPES, DEFAULT_CONDITION } from '../../../constants/property-config'

const fakeConfig = Immutable.fromJS(
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
})

const fakeRequestRulePath = Immutable.fromJS(['request_policy', 'policy_rules', 0])

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
    const activateMatch = jest.fn()
    const changeValues = jest.fn()
    const policies = shallow(
      <ConfigurationPolicies config={fakeConfig} intl={intlMaker()} changeValues={changeValues}
        activateRule={activateRule} activeRule={fakeRequestRulePath} activateMatch={activateMatch}/>
    )
    policies.instance().changeActiveRuleType(POLICY_TYPES.REQUEST)
    expect(activateRule.mock.calls[0][0][0]).toEqual('request_policy')
    policies.instance().changeActiveRuleType(POLICY_TYPES.RESPONSE)
    expect(activateRule.mock.calls[1][0][0]).toEqual('response_policy')
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
