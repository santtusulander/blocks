import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../../../util/policy-config.js')
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
    const policyRules = shallow(<ConfigurationPolicyRules />)
    expect(policyRules).toBeDefined()
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
    const activateRule = jest.fn()
    const policyRules = shallow(
      <ConfigurationPolicyRules
        requestPolicies={fakeRequestPolicyRules}
        responsePolicies={fakeResponsePolicyRules}
        activateRule={activateRule} />
    )
    const btn = policyRules.find('.activate-request-rule-0')
    btn.simulate('click', {preventDefault: jest.fn()})
    expect(activateRule.mock.calls.length).toBe(1)
    expect(activateRule.mock.calls[0][0][0]).toBe('request_policy')
    expect(activateRule.mock.calls[0][0][1]).toBe('policy_rules')
    expect(activateRule.mock.calls[0][0][2]).toBe(0)
  });

  it('should activate a response policy rule', () => {
    const activateRule = jest.fn()
    let policyRules = shallow(
      <ConfigurationPolicyRules
        requestPolicies={fakeRequestPolicyRules}
        responsePolicies={fakeResponsePolicyRules}
        activateRule={activateRule} />
    )
    const btn = policyRules.find('.activate-response-rule-0')
    btn.simulate('click', {preventDefault: jest.fn()})
    expect(activateRule.mock.calls.length).toBe(1)
    expect(activateRule.mock.calls[0][0][0]).toBe('response_policy')
    expect(activateRule.mock.calls[0][0][1]).toBe('policy_rules')
    expect(activateRule.mock.calls[0][0][2]).toBe(0)
  });
})
