import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff()
const ConfigurationPolicyRuleEdit = require('../policy-rule-edit.jsx')

describe('ConfigurationPolicyRuleEdit', () => {
  it('should exist', () => {
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}/>
    );
    expect(TestUtils.isCompositeComponent(policyRule)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit changeValue={changeValue}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}/>
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(policyRule, 'input');
    inputs[0].value = "new"
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['rule_name'])
    expect(changeValue.mock.calls[0][1]).toBe('new')
  });

  it('should save changes', () => {
    const hideAction = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit hideAction={hideAction}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(policyRule, 'form');
    TestUtils.Simulate.submit(form)
    expect(hideAction.mock.calls.length).toBe(1)
  });

  it('should activate a match', () => {
    const activateMatch = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit activateMatch={activateMatch}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}/>
    );
    policyRule.activateMatch('aaa')()
    expect(activateMatch.mock.calls[0][0]).toBe('aaa')
  });

  it('should activate a set', () => {
    const activateSet = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit activateSet={activateSet}
        rule={Immutable.Map()}
        config={Immutable.Map()}
        rulePath={[]}/>
    );
    policyRule.activateSet('aaa')()
    expect(activateSet.mock.calls[0][0]).toBe('aaa')
  });
})
