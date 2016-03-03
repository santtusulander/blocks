import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
const ConfigurationPolicyRuleEdit = require('../policy-rule-edit.jsx')

describe('ConfigurationPolicyRuleEdit', () => {
  it('should exist', () => {
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit />
    );
    expect(TestUtils.isCompositeComponent(policyRule)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit changeValue={changeValue} />
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(policyRule, 'input');
    inputs[0].value = "new"
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['path'])
    expect(changeValue.mock.calls[0][1]).toBe('new')
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let policyRule = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRuleEdit saveChanges={saveChanges}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(policyRule, 'form');
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
