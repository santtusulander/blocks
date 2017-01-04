import React from 'react'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.unmock('../forgot-password.jsx')
import { ForgotPassword } from '../forgot-password.jsx'

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.genMockFunction(),
    logIn: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    }),
    checkToken: jest.genMockFunction().mockImplementation(() => {
      return {payload: {token:null}}
    })
  }
}

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ForgotPassword', () => {
  let forgotPassword;

  beforeEach(() => {
    forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
  });

  it('should exist', () => {
    expect(forgotPassword).toBeDefined();
  })

  it('maintains form state', () => {
    let inputs = forgotPassword.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    expect(forgotPassword.state('email')).toBe('aaa')
  })

  it('toggles active class when focused and blurred', () => {
    let inputs = forgotPassword.find('FormControl')

    const usernameHolder = inputs.at(0)
    expect(forgotPassword.state('emailActive')).toBe(false)
    usernameHolder.simulate('focus')
    expect(forgotPassword.state('emailActive')).toBe(true)
    usernameHolder.simulate('blur')
    expect(forgotPassword.state('emailActive')).toBe(false)
  })

  it('requires email AND recaptcha token to submit', () => {
    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: 'a@b.c', recaptcha: null })
    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: null, recaptcha: '1234567890' })
    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: 'a@b.c', recaptcha: '1234567890' })
    expect(forgotPassword.find('Button').props().disabled).toBe(false)
  })

  it('handles errors', () => {
    forgotPassword.setState({ formError: 'Test fail'})
    expect(forgotPassword.find('.login-info').text()).toContain('Test fail')

  })

  it('toggles invalid class on error', () => {
    forgotPassword.setState({ formError: 'Test fail'})
    expect(forgotPassword.find('.invalid').length).toBe(1)
    forgotPassword.setState({ formError: ''})
    expect(forgotPassword.find('.invalid').length).toBe(0)
  })
})
