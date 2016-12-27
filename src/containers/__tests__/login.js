import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login.jsx')
import { Login } from '../login.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.fn(),
    fetchUser: jest.fn().mockImplementation(() => Promise.resolve()),
    logIn: jest.fn().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    }),
    checkToken: jest.fn().mockImplementation(() => {
      return {payload: {token:null}}
    }),
    saveName: jest.fn()
  }
}

const subject = () => {
  return (
    <Login
      userActions={userActionsMaker({})}
      intl={intlMaker()}
      location={{query: {}}}
    />
  )
}

describe('Login', () => {
  it('should exist', () => {
    const login = shallow( subject() )
    expect(login.length).toBe(1)
  })

  it('should show only LoginForm component by default', () => {
    const login = shallow( subject() )
    expect(login.find('LoginForm').length).toBe(1)
    expect(login.find('LoginFormTwoFactorApp').length).toBe(0)
    expect(login.find('LoginFormTwoFactorCode').length).toBe(0)
  })

  it('should have LoginFormTwoFactorApp component', () => {
    const login = shallow( subject() )
    login.setState({twoFACodeValidation: true})
    expect(login.find('LoginForm').length).toBe(0)
    expect(login.find('LoginFormTwoFactorApp').length).toBe(0)
    expect(login.find('LoginFormTwoFactorCode').length).toBe(1)
  })

  it('should have LoginFormTwoFactorCode component', () => {
    const login = shallow( subject() )
    login.setState({twoFAAuthyAppValidation: true})
    expect(login.find('LoginForm').length).toBe(0)
    expect(login.find('LoginFormTwoFactorApp').length).toBe(1)
    expect(login.find('LoginFormTwoFactorCode').length).toBe(0)
  })
})
