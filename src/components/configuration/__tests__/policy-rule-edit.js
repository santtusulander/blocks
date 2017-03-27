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

const fakeConfig = Immutable.fromJS({
                    "rule_name": "newRule123",
                    "rule_body": {
                      "actions": [
                        {
                          "cache_control": {
                            "check_etag": "false",
                            "max_age": 604800,
                            "no_store": true,
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
                  })

const fakeRulePath = Immutable.fromJS(["request_policy", "policy_rules", 0])

describe('ConfigurationPolicyRuleEdit', () => {

  it('should exist', () => {
    const policyRule = shallow(<ConfigurationPolicyRuleEdit rule={Immutable.Map()}
      rule={fakeConfig}
      config={Immutable.Map()}
      rulePath={Immutable.List()}
      activeAccount={fakeAccounts}
      activeGroup={fakeGroups}
      location={fakeLocation}/>)
    expect(policyRule).toBeDefined()
  });
//TODO-2277

  // it('should change values', () => {
  //   const changeValue = jest.fn()
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit changeValue={changeValue}
  //       rule={fakeConfig}
  //       config={Immutable.Map()}
  //       rulePath={Immutable.List()}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //   let inputs = TestUtils.scryRenderedDOMComponentsWithTag(policyRule, 'input');
  //   inputs[0].value = "new"
  //   TestUtils.Simulate.change(inputs[0])
  //   expect(changeValue.mock.calls[0][0].toJS()).toEqual(['rule_name'])
  //   expect(changeValue.mock.calls[0][1]).toBe('new')
  // });

  // it('should save changes', () => {
  //   const hideAction = jest.fn()
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit hideAction={hideAction}
  //       rule={fakeConfig}
  //       config={Immutable.Map()}
  //       rulePath={Immutable.List()}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //   let form = TestUtils.findRenderedDOMComponentWithTag(policyRule, 'form');
  //   TestUtils.Simulate.submit(form)
  //   expect(hideAction.mock.calls.length).toBe(1)
  // });

  // it('should activate a match', () => {
  //   const activateMatch = jest.fn()
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit activateMatch={activateMatch}
  //       rule={fakeConfig}
  //       config={Immutable.Map()}
  //       rulePath={Immutable.List()}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //   policyRule.activateMatch('aaa')()
  //   expect(activateMatch.mock.calls[0][0]).toBe('aaa')
  // });

  // it('should activate a set', () => {
  //   const activateSet = jest.fn()
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit activateSet={activateSet}
  //       rule={fakeConfig}
  //       config={Immutable.Map()}
  //       rulePath={Immutable.List()}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //   policyRule.activateSet('aaa')()
  //   expect(activateSet.mock.calls[0][0]).toBe('aaa')
  // });

  // it('should move a set', () => {
  //   const changeValue = jest.fn()
  //   const activateSet = jest.fn()
  //   let policyRule = shallow(
  //     <ConfigurationPolicyRuleEdit
  //       rule={fakeConfig}
  //       config={fakeConfig}
  //       rulePath={Immutable.List()}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       changeValue={changeValue}
  //       activateSet={activateSet}
  //       location={fakeLocation}/>
  //   );
  //   const conditions = policyRule.find('.condition')
  //   const sets = conditions.at(1)
  //   const set = sets.at(0)
  //   const actionButtons = set.find('ActionButtons').shallow()
  //   const buttons = actionButtons.find('Button')
  //   buttons.at(1).simulate('click', { preventDefault: jest.fn(), stopPropagation: jest.fn() })
  //   expect(changeValue.mock.calls.length).toBe(1)
  //   expect(activateSet.mock.calls.length).toBe(1)
  // });

  // it('should show current matches', () => {
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit
  //       rule={fakeConfig}
  //       activeMatchPath={Immutable.List([ 'request_policy', 'policy_rules', 0, 'match' ])}
  //       config={Immutable.Map()}
  //       rulePath={fakeRulePath}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //     let conditions = TestUtils.scryRenderedDOMComponentsWithClass(policyRule, 'conditions');
  //     expect(conditions[0].textContent).toContain('foo');
  // });

  // it('should show current sets', () => {
  //   let policyRule = TestUtils.renderIntoDocument(
  //     <ConfigurationPolicyRuleEdit
  //       rule={fakeConfig}
  //       activeSetPath={Immutable.List([ 'request_policy', 'policy_rules', 0, 'set', 'zyx' ])}
  //       config={Immutable.Map()}
  //       rulePath={fakeRulePath}
  //       activeAccount={fakeAccounts}
  //       activeGroup={fakeGroups}
  //       location={fakeLocation}/>
  //   );
  //     let conditions = TestUtils.scryRenderedDOMComponentsWithClass(policyRule, 'conditions');
  //     expect(conditions[1].textContent).toContain('bar');
  // });
})
