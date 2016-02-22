import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../login.jsx')
const Login = require('../login.jsx').Login

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.genMockFunction(),
    logIn: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    })
  }
}

describe('Login', () => {
  it('should exist', () => {
    const login = TestUtils.renderIntoDocument(
      <Login />
    )
    expect(TestUtils.isCompositeComponent(login)).toBeTruthy();
  })

  it('can show / hide password', () => {
    const login = TestUtils.renderIntoDocument(
      <Login />
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(login, 'input')
    expect(inputs[1].type).toBe('password')
    let toggler = TestUtils.findRenderedDOMComponentWithClass(login, 'input-addon-link')
    TestUtils.Simulate.click(toggler)
    expect(inputs[1].type).toBe('text')
  })

  it('maintains form state', () => {
    const login = TestUtils.renderIntoDocument(
      <Login />
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
      <Login />
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
      <Login userActions={userActions}/>
    )
    login.setState({username: 'aaa', password: 'bbb'})
    const form = TestUtils.findRenderedDOMComponentWithTag(login, 'form')
    TestUtils.Simulate.submit(form)
    expect(userActions.logIn.mock.calls[0][0]).toBe('aaa')
    expect(userActions.logIn.mock.calls[0][1]).toBe('bbb')
    const errorMsg = TestUtils.findRenderedDOMComponentWithClass(login, 'alert')
    expect(errorMsg.textContent).toContain('Test fail')
  })

  it('handles a successful log in attempt', () => {
    const userActions = userActionsMaker({})
    const fakeHistory = {
      pushState: jest.genMockFunction()
    }
    const login = TestUtils.renderIntoDocument(
      <Login userActions={userActions}
        history={fakeHistory}/>
    )
    login.setState({username: 'aaa', password: 'bbb'})
    const form = TestUtils.findRenderedDOMComponentWithTag(login, 'form')
    TestUtils.Simulate.submit(form)
    expect(fakeHistory.pushState.mock.calls[0][1]).toBe('/')
  })
})
