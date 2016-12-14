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
    let inputs = forgotPassword.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    expect(forgotPassword.state('email')).toBe('aaa')
  })

  it('toggles active class when focused and blurred', () => {
    const forgotPassword = shallow(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    let inputs = forgotPassword.find('FormControl')

    const usernameHolder = inputs.at(0)
    expect(forgotPassword.state('emailActive')).toBe(false)
    usernameHolder.simulate('focus')
    expect(forgotPassword.state('emailActive')).toBe(true)
    usernameHolder.simulate('blur')
    expect(forgotPassword.state('emailActive')).toBe(false)
  })
})
