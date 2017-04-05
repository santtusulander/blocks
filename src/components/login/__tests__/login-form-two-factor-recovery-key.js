import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form-two-factor-recovery-key.jsx')
import { LoginFormTwoFactorRecoveryKey } from '../login-form-two-factor-recovery-key.jsx'
import { RECOVERY_KEY_INPUT_FIELD_NAMES, RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH } from '../../../constants/login.js'

const NUM_OF_CODE_INPUTS = RECOVERY_KEY_INPUT_FIELD_NAMES.length

const subject = (fetching = false) => {
  return <LoginFormTwoFactorRecoveryKey fetching={fetching} />
}

describe('LoginFormTwoFactorRecoveryKey', () => {
  it('should exist', () => {
    const loginFormRecovery = shallow(subject())
    expect(loginFormRecovery.length).toBe(1)
  })

  it('should have 4 inputs', () => {
    const loginFormRecovery = shallow(subject())
    expect(loginFormRecovery.find('FormControl').length).toBe(NUM_OF_CODE_INPUTS)
  })

  it('inputs should have maxLength equals 3', () => {
    const loginFormRecovery = shallow(subject())
    const inputs = loginFormRecovery.find('FormControl')

    for (let i = 0; i < NUM_OF_CODE_INPUTS; i++)
    {
      expect(inputs.at(i).node.props.maxLength).toBe(3)
    }
  })

  describe('error handling', () => {
    it('should not show error message without login error', () => {
      const loginFormRecovery = shallow(subject())
      expect(loginFormRecovery.find('.token-input-info').text()).not.toContain('Test error')
    })

    it('should show error message on login error', () => {
      const loginFormRecovery = shallow(subject())
      loginFormRecovery.setState({loginError: 'Test error'})
      expect(loginFormRecovery.find('.token-input-info').text()).toContain('Test error')
    })
  })

  describe('fetching data handling', () => {
    it('should show a small loading spinner when fetching data', () => {
      const loginFormRecovery = shallow(subject(true))
      expect(loginFormRecovery.find('LoadingSpinnerSmall').length).toBe(1)
    })

    it('should hide HaveTrouble button when fetching data', () => {
      const loginFormRecovery = shallow(subject(true))
      expect(loginFormRecovery.find('.having-trouble-link').length).toBe(0)
    })

    it('should not show a small loading spinner when fetching data operation has been completed', () => {
      const loginFormRecovery = shallow(subject())
      expect(loginFormRecovery.find('LoadingSpinnerSmall').length).toBe(0)
    })

    it('should show HaveTrouble button when fetching data operation has been completed', () => {
      const loginFormRecovery = shallow(subject())
      expect(loginFormRecovery.find('.having-trouble-link').length).toBe(1)
    })
  })
})
