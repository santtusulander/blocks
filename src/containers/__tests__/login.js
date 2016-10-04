import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {shallow} from 'enzyme'
import { Input } from 'react-bootstrap'

jest.mock('../../util/helpers', () => {
  return {
    getContentUrl: jest.genMockFunction()
      .mockImplementation(val => '/path/after/login')
  }
})

jest.autoMockOff()
jest.dontMock('../login.jsx')
const Login = require('../login.jsx').Login

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
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(login, 'input')
    expect(login.state.rememberUsername).toBe(false)
    TestUtils.Simulate.change(inputs[2])
    expect(login.state.rememberUsername).toBe(true)
  })

  it('maintains form state', () => {
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(login, 'input')
    inputs[0].value = 'aaa'
    TestUtils.Simulate.change(inputs[0])
    inputs[1].value = 'bbb'
    TestUtils.Simulate.change(inputs[1])
    expect(login.state.username).toBe('aaa')
    expect(login.state.password).toBe('bbb')
  })

  it('toggles active class when focused and blurred', () => {
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActionsMaker({})} intl={intlMaker()}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(login, 'input')

    const usernameHolder = TestUtils.findRenderedDOMComponentWithClass(login, 'login-label-username')
    expect(usernameHolder.getAttribute('class')).not.toContain('active')
    TestUtils.Simulate.focus(inputs[0])
    expect(usernameHolder.getAttribute('class')).toContain('active')
    TestUtils.Simulate.blur(inputs[0])
    expect(usernameHolder.getAttribute('class')).not.toContain('active')

    const passwordHolder = TestUtils.findRenderedDOMComponentWithClass(login, 'login-label-password')
    expect(passwordHolder.getAttribute('class')).not.toContain('active')
    TestUtils.Simulate.focus(inputs[1])
    expect(passwordHolder.getAttribute('class')).toContain('active')
    TestUtils.Simulate.blur(inputs[1])
    expect(passwordHolder.getAttribute('class')).not.toContain('active')
  })

  it('handles a failed log in attempt', () => {
    const failedAction = {error: true, payload: {message: 'Test fail'}}
    const userActions = userActionsMaker(failedAction)
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActions} intl={intlMaker()}/>
    )
    login.setState({username: 'aaa', password: 'bbb'})
    const form = TestUtils.findRenderedDOMComponentWithTag(login, 'form')
    TestUtils.Simulate.submit(form)
    expect(userActions.logIn.mock.calls[0][0]).toBe('aaa')
    expect(userActions.logIn.mock.calls[0][1]).toBe('bbb')
    const errorMsg = TestUtils.findRenderedDOMComponentWithClass(login, 'login-info')
    expect(errorMsg.textContent).toContain('Test fail')
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
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActions}
        accountActions={accountActions}
        rolesActions={rolesActions}
        router={fakeRouter}
        intl={intlMaker()}/>
    )
    login.setState({username: 'aaa', password: 'bbb', rememberUsername: true})
    const form = TestUtils.findRenderedDOMComponentWithTag(login, 'form')
    TestUtils.Simulate.submit(form)
    expect(userActions.saveName.mock.calls[0][0]).toBe('aaa')
    expect(rolesActions.fetchRoles.mock.calls.length).toBe(1)
    expect(userActions.fetchUser.mock.calls[0][0]).toBe('aaa')
  })
})
