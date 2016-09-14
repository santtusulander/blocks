import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../forgot-password.jsx')
const ForgotPassword = require('../forgot-password.jsx').ForgotPassword

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
    const forgotPassword = TestUtils.renderIntoDocument(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    expect(TestUtils.isCompositeComponent(forgotPassword)).toBeTruthy();
  })

  it('maintains form state', () => {
    const forgotPassword = TestUtils.renderIntoDocument(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(forgotPassword, 'input')
    inputs[0].value = 'aaa'
    TestUtils.Simulate.change(inputs[0])
    expect(forgotPassword.state.email).toBe('aaa')
  })

  it('toggles active class when focused and blurred', () => {
    const forgotPassword = TestUtils.renderIntoDocument(
      <ForgotPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(forgotPassword, 'input')

    const usernameHolder = TestUtils.findRenderedDOMComponentWithClass(forgotPassword, 'login-label-email')
    expect(usernameHolder.getAttribute('class')).not.toContain('active')
    TestUtils.Simulate.focus(inputs[0])
    expect(usernameHolder.getAttribute('class')).toContain('active')
    TestUtils.Simulate.blur(inputs[0])
    expect(usernameHolder.getAttribute('class')).not.toContain('active')
  })
})
