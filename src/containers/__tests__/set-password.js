import React from 'react'
import { Tooltip } from 'react-bootstrap'
import TestUtils from 'react-addons-test-utils'

jest.mock('../../util/helpers', () => {
  return {
    getContentUrl: jest.genMockFunction()
      .mockImplementation(val => '/path/after/login'),
    matchesRegexp: jest.fn()
  }
})

jest.autoMockOff()
jest.dontMock('../set-password.jsx')
const SetPassword = require('../set-password.jsx').SetPassword

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

describe('SetPassword', () => {
  it('should exist', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    expect(TestUtils.isCompositeComponent(setPassword)).toBeTruthy();
  })

  it('can show / hide password', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    expect(inputs[0].type).toBe('password')
    let toggler = TestUtils.scryRenderedDOMComponentsWithClass(setPassword, 'input-addon-link')
    TestUtils.Simulate.click(toggler[0])
    expect(inputs[0].type).toBe('text')
  })

  it('maintains form state', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    inputs[0].value = 'aaa'
    TestUtils.Simulate.change(inputs[0])
    inputs[1].value = 'bbb'
    TestUtils.Simulate.change(inputs[1])
    expect(setPassword.state.password).toBe('aaa')
    expect(setPassword.state.confirm).toBe('bbb')
  })

  it('toggles active class when focused and blurred', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')

    const passwordHolder = TestUtils.findRenderedDOMComponentWithClass(setPassword, 'login-label-password')
    expect(passwordHolder.getAttribute('class')).not.toContain('active')
    TestUtils.Simulate.focus(inputs[0])
    expect(passwordHolder.getAttribute('class')).toContain('active')
    TestUtils.Simulate.blur(inputs[0])
    expect(passwordHolder.getAttribute('class')).not.toContain('active')

    const confirmHolder = TestUtils.findRenderedDOMComponentWithClass(setPassword, 'login-label-confirm')
    expect(confirmHolder.getAttribute('class')).not.toContain('active')
    TestUtils.Simulate.focus(inputs[1])
    expect(confirmHolder.getAttribute('class')).toContain('active')
    TestUtils.Simulate.blur(inputs[1])
    expect(confirmHolder.getAttribute('class')).not.toContain('active')
  })

  it('shows a tooltip', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    let tooltip = TestUtils.scryRenderedComponentsWithType(setPassword, Tooltip)
    expect(tooltip.length).toBe(0)
    TestUtils.Simulate.focus(inputs[0])
    tooltip = TestUtils.scryRenderedComponentsWithType(setPassword, Tooltip)
    expect(tooltip.length).toBe(1)
  })

  it('validates the password', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    inputs[0].value = 'invalid_password'
    TestUtils.Simulate.change(inputs[0])
    expect(setPassword.state.passwordValid).toBe(false)
    inputs[0].value = 'V@lid_P@55word'
    TestUtils.Simulate.change(inputs[0])
    expect(setPassword.state.passwordValid).toBe(true)
  })

  it('does not compare when password is invalid', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    inputs[0].value = 'invalid_password'
    TestUtils.Simulate.change(inputs[0])
    inputs[1].value = 'invalid_password'
    TestUtils.Simulate.change(inputs[1])
    expect(setPassword.state.confirmValid).toBe(false)
  })

  it('does not give a match if password is valid but does not match confirm', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    inputs[0].value = 'V@lid_P@55word'
    TestUtils.Simulate.change(inputs[0])
    inputs[1].value = 'different_password'
    TestUtils.Simulate.change(inputs[1])
    expect(setPassword.state.confirmValid).toBe(false)
  })

  it('give a valid match when password is valid and matches confirm', () => {
    const setPassword = TestUtils.renderIntoDocument(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(setPassword, 'input')
    inputs[0].value = 'V@lid_P@55word'
    TestUtils.Simulate.change(inputs[0])
    inputs[1].value = 'V@lid_P@55word'
    TestUtils.Simulate.change(inputs[1])
    expect(setPassword.state.confirmValid).toBe(true)
  })
})
