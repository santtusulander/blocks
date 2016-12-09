import React from 'react'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.unmock('../password/forgot-password.jsx')
import { ForgotPassword } from '../password/forgot-password.jsx'

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

describe('ForgotPassword', () => {
  it('should exist', () => {
    const forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    expect(forgotPassword).toBeDefined();
  })

  it('maintains form state', () => {
    const forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    let inputs = forgotPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    expect(forgotPassword.state('email')).toBe('aaa')
  })

  it('toggles active class when focused and blurred', () => {
    const forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    let inputs = forgotPassword.find('Input')

    const usernameHolder = inputs.at(0)
    expect(forgotPassword.state('emailActive')).toBe(false)
    usernameHolder.simulate('focus')
    expect(forgotPassword.state('emailActive')).toBe(true)
    usernameHolder.simulate('blur')
    expect(forgotPassword.state('emailActive')).toBe(false)
  })

  it('requires email AND recaptcha token to submit', () => {
    const forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )

    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: 'a@b.c', recaptcha: null })
    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: null, recaptcha: '1234567890' })
    expect(forgotPassword.find('Button').props().disabled).toBe(true)

    forgotPassword.setState({ email: 'a@b.c', recaptcha: '1234567890' })
    expect(forgotPassword.find('Button').props().disabled).toBe(false)
  })
})
