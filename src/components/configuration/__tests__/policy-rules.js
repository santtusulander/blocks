import React from 'react'
import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'

jest.unmock('../../confirmation')
jest.unmock('../policy-rules')
jest.unmock('../../../components/action-buttons')
jest.unmock('../../../util/policy-config')
jest.unmock('../../../components/icon')
jest.unmock('../../../components/icons/icon-edit')
jest.unmock('../../../components/icons/icon-trash')
const ConfigurationPolicyRules = require('../policy-rules')

const requestPolicies = Immutable.fromJS(
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

const responsePolicies = Immutable.fromJS(
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

  let subject = null

  const intlMaker = () => {
    return {
      formatMessage: jest.fn()
    }
  }

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = Object.assign({}, {
        intl: intlMaker()
      }, props)
      return shallow(<ConfigurationPolicyRules {...defaultProps}/>)
    }
  })


  it('should exist', () => {
    expect(subject()).toBeDefined()
  });

  it('should set and reset policy types', () => {
    let policyRules = subject()

    expect(policyRules.state().request_policy).toBe(null);

    policyRules.instance().showConfirmation('request_policy', 'foo')();
    expect(policyRules.state().request_policy).toBe('foo');

    policyRules.instance().closeConfirmation('request_policy')();
    expect(policyRules.state().request_policy).toBe(null);
  })

  it('should activate a policy rule', () => {

    const activateRule = e => jest.fn()

    const policyRules = subject({
      requestPolicies,
      responsePolicies,
      activateRule
    })

    const btn = policyRules.find('tbody #edit-button').at(0)
    console.log(btn.text());
    btn.simulate('click')
    console.log(activateRule());
    // expect(activateRule.mock.calls.length).toBe(1)
    // expect(activateRule.mock.calls[0][0][0]).toBe('request_policy')
    // expect(activateRule.mock.calls[0][0][1]).toBe('policy_rules')
    // expect(activateRule.mock.calls[0][0][2]).toBe(0)
  })
})
