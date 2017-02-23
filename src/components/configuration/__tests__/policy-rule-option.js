import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('classnames')
jest.unmock('../policy-rule-option.jsx')
import PolicyRuleOption from '../policy-rule-option.jsx'

describe('PolicyRuleOption', () => {
  let subject
  let fakeCheckIfEnabled
  let fakeOnClick
  let fakeOption
  let fakePolicyType

  beforeEach(() => {
    fakeCheckIfEnabled = jest.fn()
    fakeOnClick = jest.fn()
    fakeOption = {
      key: 'aaa',
      name: 'bbb',
      compatibleWith: ['request_policy']
    }
    fakePolicyType = 'request_policy'

    subject = () => {
      return shallow(
        <PolicyRuleOption
          checkIfEnabled={fakeCheckIfEnabled}
          onClick={fakeOnClick}
          option={fakeOption}
          policyType={fakePolicyType}
        />
      )
    }
  })

  it('should exist', () => {
    expect(subject()).toBeDefined()
  })

  it('should not exist unless compatible with current policy', () => {
    fakePolicyType = 'response_policy'
    expect(subject().html()).toBeNull()
  })

  it('should be able to be disabled by function prop', () => {
    fakeCheckIfEnabled = jest.fn(() => false)

    const link = subject().find('a').at(0)
    expect(link.onClick).toBeUndefined()
    expect(link.hasClass('inactive')).toBeTruthy()
  })

  it('should be able to be disabled based on option values', () => {
    fakeOption.notYetImplemented = true

    const link = subject().find('a').at(0)
    expect(link.onClick).toBeUndefined()
    expect(link.hasClass('inactive')).toBeTruthy()
  })

  it('should check for admin role, if needed', () => {
    expect(subject().find('IsAdmin').length).toBe(0)
    fakeOption.requiresAdmin = true
    expect(subject().find('IsAdmin').length).toBe(1)
  })
})
