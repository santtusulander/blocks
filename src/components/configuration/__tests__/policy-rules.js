import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../policy-rules.jsx')
const ConfigurationPolicyRules = require('../policy-rules.jsx')

const fakeRequestPolicyRules = Immutable.fromJS(
  [{
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
  }]
)

const fakeResponsePolicyRules = Immutable.fromJS(
  [{
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
  }]
)

describe('ConfigurationPolicyRules', () => {
  it('should exist', () => {
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules />
    );
    expect(TestUtils.isCompositeComponent(policyRules)).toBeTruthy();
  });

  it('should show loading message', () => {
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules />
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(policyRules, 'div')
    expect(ReactDOM.findDOMNode(div).textContent).toContain('Loading...');
  });

  it('should set and reset policy types', () => {
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules />
    );
    expect(policyRules.state.request_policy).toBe(null);
    policyRules.showConfirmation('request_policy', 'foo')();
    expect(policyRules.state.request_policy).toBe('foo');
    policyRules.closeConfirmation('request_policy')();
    expect(policyRules.state.request_policy).toBe(null);
  });

  it('should activate a request policy rule', () => {
    const activateRule = jest.genMockFunction()
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules
        requestPolicies={fakeRequestPolicyRules}
        responsePolicies={fakeResponsePolicyRules}
        activateRule={activateRule} />
    );
    let btn = TestUtils.scryRenderedDOMComponentsWithTag(policyRules, 'button');
    TestUtils.Simulate.click(btn[0]);
    expect(activateRule.mock.calls.length).toBe(1)
    expect(activateRule.mock.calls[0][0][0]).toBe('request_policy')
    expect(activateRule.mock.calls[0][0][1]).toBe('policy_rules')
    expect(activateRule.mock.calls[0][0][2]).toBe(0)
  });

  it('should activate a response policy rule', () => {
    const activateRule = jest.genMockFunction()
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules
        requestPolicies={fakeRequestPolicyRules}
        responsePolicies={fakeResponsePolicyRules}
        activateRule={activateRule} />
    );
    let btn = TestUtils.scryRenderedDOMComponentsWithTag(policyRules, 'button');
    TestUtils.Simulate.click(btn[2]);
    expect(activateRule.mock.calls.length).toBe(1)
    expect(activateRule.mock.calls[0][0][0]).toBe('response_policy')
    expect(activateRule.mock.calls[0][0][1]).toBe('policy_rules')
    expect(activateRule.mock.calls[0][0][2]).toBe(0)
  });
})
