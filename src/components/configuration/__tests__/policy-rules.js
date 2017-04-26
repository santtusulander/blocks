import React from 'react'
import { fromJS } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../policy-rules')

import ConfigurationPolicyRules from '../policy-rules'

const requestPolicies = fromJS(
  [{
    "rule_name": "newRule123",
    "rule_body": {
      "actions": [
        {
          "cache_control": {
            "check_etag": "false",
            "max_age": 604800,
            "no_store": false,
            "honor_origin": true
          }
        }
      ],
      "conditions": [
        {
          "type": "equals",
          "field": "request_url",
          "field_detail": "",
          "value": "(.*)\\\\.(sdf|sdf|sdf)",
          "inverted": false,
          "_temp": true
        },
        {
          "type": "equals",
          "field": "request_cookie",
          "field_detail": "",
          "value": "qwqw",
          "inverted": false
        }
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
        cancelDeletePolicyRoute: () => {},
        intl: intlMaker()
      }, props)
      return shallow(<ConfigurationPolicyRules {...defaultProps}/>)
    }
  })

  it('should exist', () => {
    expect(subject()).toBeDefined()
  })

  it('should set and reset policy types', () => {
    let policyRules = subject()
    expect(policyRules.state().request_policy).toBe(null);

    policyRules.instance().showConfirmation('request_policy', 'foo')();
    expect(policyRules.state().request_policy).toBe('foo');

    policyRules.instance().closeConfirmation('request_policy')();
    expect(policyRules.state().request_policy).toBe(null);
  })
})
