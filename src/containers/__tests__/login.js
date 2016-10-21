import React from 'react'
import {shallow} from 'enzyme'

jest.autoMockOff()
jest.unmock('../login.jsx')
import { Login } from '../login.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.genMockFunction(),
    fetchUser: jest.genMockFunction().mockImplementation(() => Promise.resolve()),
    logIn: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    }),
    checkToken: jest.genMockFunction().mockImplementation(() => {
      return {payload: {token:null}}
    }),
    saveName: jest.genMockFunction()
  }
}

function accountActionsMaker(cbResponse) {
  return {
    startFetching: jest.genMockFunction(),
    fetchAccounts: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    })
  }
}

function rolesActionsMaker() {
  return {
    fetchRoles: jest.genMockFunction().mockImplementation(() => Promise.resolve())
  }
}

describe('Login', () => {
  it('should exist', () => {
    const login = shallow(<Login userActions={userActionsMaker({})} intl={intlMaker()}/>)
    expect(login.length).toBe(1)
  })

  it('toggles username remember', () => {
    const login = shallow(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    const inputs = login.find('Input')
    expect(login.state('rememberUsername')).toBe(false)
    inputs.at(2).simulate('change')
    expect(login.state('rememberUsername')).toBe(true)
  })

  it('maintains form state', () => {
    const login = shallow(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    const inputs = login.find('Input')
    inputs.at(0).simulate('change',{target: {value: 'aaa'}})
    inputs.at(1).simulate('change', {target: {value: 'bbb'}})
    expect(login.state('username')).toBe('aaa')
    expect(login.state('password')).toBe('bbb')
  })

  it('toggles active class when focused and blurred', () => {
    const login = shallow(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    const inputs = login.find('Input')

    const usernameHolder = inputs.at(0)
    expect(login.state('usernameActive')).toBe(false)
    usernameHolder.simulate('focus')
    expect(login.state('usernameActive')).toBe(true)
    usernameHolder.simulate('blur')
    expect(login.state('usernameActive')).toBe(false)

    expect(login.state('passwordActive')).toBe(false)
    inputs.at(1).simulate('focus')
    expect(login.state('passwordActive')).toBe(true)
    inputs.at(1).simulate('blur')
    expect(login.state('passwordActive')).toBe(false)
  })

  it('handles a failed log in attempt', () => {
    const failedAction = {error: true, payload: {message: 'Test fail'}}
    const userActions = userActionsMaker(failedAction)
    const login = shallow(
      <Login userActions={userActions} intl={intlMaker()}/>
    )
    login.setState({username: 'aaa', password: 'bbb'})
    const form = login.find('form')
    form.simulate('submit', { preventDefault: () => {/* noop */} })
    expect(userActions.logIn.mock.calls[0][0]).toBe('aaa')
    expect(userActions.logIn.mock.calls[0][1]).toBe('bbb')
    const errorMsg = login.find('.login-info')
    expect(errorMsg.text()).toContain('Test fail')
  })

  it('handles a successful log in attempt', () => {
    const userActions = userActionsMaker({})
    const accountActions = accountActionsMaker({
      payload: {
        data: [
          {id: 1}
        ]
      }
    })
    const rolesActions = rolesActionsMaker()
    const fakeRouter = {
      push: jest.genMockFunction()
    }
    const login = shallow(
      <Login userActions={userActions}
        accountActions={accountActions}
        rolesActions={rolesActions}
        router={fakeRouter}
        intl={intlMaker()}/>
    )
    login.setState({username: 'aaa', password: 'bbb', rememberUsername: true})
    const form = login.find('form')
    form.simulate('submit', { preventDefault: () => {/* noop */} })
    expect(userActions.saveName.mock.calls[0][0]).toBe('aaa')
    expect(rolesActions.fetchRoles.mock.calls.length).toBe(1)
    expect(userActions.fetchUser.mock.calls[0][0]).toBe('aaa')
  })
})
