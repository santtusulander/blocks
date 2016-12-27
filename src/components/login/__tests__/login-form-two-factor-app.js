import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form-two-factor-app.jsx')
import { LoginFormTwoFactorApp } from '../login-form-two-factor-app.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const subject = () => {
  const props = {
    startAppPulling: jest.fn(),
    loginError: '',
    intl: intlMaker()
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
})
