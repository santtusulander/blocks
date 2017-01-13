import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form-two-factor-app.jsx')
import { LoginFormTwoFactorApp } from '../login-form-two-factor-app.jsx'

const subject = (loginErrorStr = '') => {
  const props = {
    startAppPulling: jest.fn(),
    loginError: loginErrorStr
  }

  return (
    <LoginFormTwoFactorApp {...props} />
  )
}

describe('LoginFormTwoFactorApp', () => {
  it('should exist', () => {
    const loginFormApp = shallow(
      subject()
    )
    expect(loginFormApp.length).toBe(1)
  })

  it('should show a small loading spinner', () => {
    const loginFormApp = shallow(
      subject()
    )
    expect(loginFormApp.find('LoadingSpinnerSmall').length).toBe(1)
  })

  describe('error handling', () => {
    it('should not show error message without login error', () => {
      const loginFormApp = shallow(
        subject()
      )
      expect(loginFormApp.find('.token-input-info').at(0).text()).not.toContain('Test error')
    })

    it('should show small loading spinner on login error', () => {
      const loginFormApp = shallow(
        subject('Test error')
      )
      expect(loginFormApp.find('LoadingSpinnerSmall').length).toBe(1)
    })

    it('should not show error message on login error', () => {
      const loginFormApp = shallow(
        subject('Test error')
      )
      expect(loginFormApp.find('.token-input-info').at(0).text()).not.toContain('Test error')
    })
  })
})
