import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.autoMockOff()
const ConfigurationPolicyRuleEdit = require('../policy-rule-edit.jsx')

const fakeAccounts = Immutable.fromJS([
  {id: '1', name: 'aaa'},
  {id: '2', name: 'bbb'}
])

const fakeGroups = Immutable.fromJS([
  {id: '1', name: 'aaa'},
  {id: '2', name: 'bbb'}
])

const fakeLocation = {query: {name: 'www.abc.com'}}

const fakeMatch = Immutable.fromJS({
  "match": {
    "field": "request_host",
    "cases": [
      [
        "foo",
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
      ]
    ]
  }
})

const fakeSet = Immutable.fromJS({
  "set": {
    "bar": {
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
    },
    "zyx": {
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
})

const fakeRulePath = ["request_policy", "policy_rules", 0]

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

describe('ConfigurationPolicyRuleEdit', () => {
  it('should exist', () => {
    const policyRule = shallow(<ConfigurationPolicyRuleEdit rule={Immutable.Map()}
      config={Immutable.Map()}
      rulePath={[]}
      activeAccount={fakeAccounts}
      activeGroup={fakeGroups}
      location={fakeLocation}/>)
    expect(policyRule).toBeDefined()
  });

  it('should change values', () => {
    const changeValue = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit changeValue={changeValue}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(policyRule, 'input');
    inputs[0].value = "new"
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['rule_name'])
    expect(changeValue.mock.calls[0][1]).toBe('new')
  });

  it('should save changes', () => {
    const hideAction = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit hideAction={hideAction}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(policyRule, 'form');
    TestUtils.Simulate.submit(form)
    expect(hideAction.mock.calls.length).toBe(1)
  });

  it('should activate a match', () => {
    const activateMatch = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit activateMatch={activateMatch}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
    policyRule.activateMatch('aaa')()
    expect(activateMatch.mock.calls[0][0]).toBe('aaa')
  });

  it('should activate a set', () => {
    const activateSet = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit activateSet={activateSet}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
    policyRule.activateSet('aaa')()
    expect(activateSet.mock.calls[0][0]).toBe('aaa')
  });

  it('should cancel changes', () => {
    const changeValue = jest.fn()
    const hideAction = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}
        changeValue={changeValue}
        hideAction={hideAction}/>
    );
    policyRule.state.originalConfig = fakeMatch
    policyRule.cancelChanges()
    expect(changeValue.mock.calls.length).toBe(1)
    expect(changeValue.mock.calls[0][1]).toBe(fakeMatch)
    expect(hideAction.mock.calls.length).toBe(1)
  });

  it('should move a set', () => {
    const changeValue = jest.fn()
    const activateSet = jest.fn()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit
        rule={fakeSet}
        config={fakeConfig}
        rulePath={Immutable.List([])}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        changeValue={changeValue}
        activateSet={activateSet}
        location={fakeLocation}/>
    );
      let btns = TestUtils.scryRenderedDOMComponentsWithTag(policyRule, 'button');
      TestUtils.Simulate.click(btns[7])
      expect(changeValue.mock.calls.length).toBe(1)
      expect(activateSet.mock.calls.length).toBe(1)
  });

  it('should show current matches', () => {
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit
        rule={fakeMatch}
        activeMatchPath={Immutable.List([ 'request_policy', 'policy_rules', 0, 'match' ])}
        config={Immutable.Map()}
        rulePath={fakeRulePath}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
      let conditions = TestUtils.scryRenderedDOMComponentsWithClass(policyRule, 'conditions');
      expect(conditions[0].textContent).toContain('foo');
  });

  it('should show current sets', () => {
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit
        rule={fakeSet}
        activeSetPath={Immutable.List([ 'request_policy', 'policy_rules', 0, 'set', 'zyx' ])}
        config={Immutable.Map()}
        rulePath={fakeRulePath}
        activeAccount={fakeAccounts}
        activeGroup={fakeGroups}
        location={fakeLocation}/>
    );
      let conditions = TestUtils.scryRenderedDOMComponentsWithClass(policyRule, 'conditions');
      expect(conditions[1].textContent).toContain('bar');
  });
})
