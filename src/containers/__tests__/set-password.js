import React from 'react'
import { shallow } from 'enzyme'

jest.mock('../../util/routes', () => {
  return {
    getContentUrl: jest.fn(),
    matchesRegexp: jest.fn()
  }
})

jest.unmock('../set-password.jsx')
jest.unmock('../../redux/modules/filters')
import { SetPassword } from '../set-password.jsx'

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.fn(),
    logIn: jest.fn().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    }),
    checkToken: jest.fn().mockImplementation(() => {
      return {payload: {token:null}}
    })
  }
}

describe('SetPassword', () => {
  it('should exist', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    expect(setPassword).toBeTruthy();
  })

  it('can show / hide password', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    expect(setPassword.find('#password').prop('type')).toBe('password')
    // setPassword.find('.input-addon-link').at(0).simulate('click')
    setPassword.setState({passwordVisible: true})
    expect(setPassword.find('#password').prop('type')).toBe('text')
  })

  it('maintains form state', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    let inputs = setPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    inputs.at(1).simulate('change', {target: {value: 'bbb'}})
    expect(setPassword.state('password')).toBe('aaa')
    expect(setPassword.state('confirm')).toBe('bbb')
  })

  it('toggles active class when focused and blurred', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')

    const usernameHolder = inputs.at(0)
    expect(setPassword.state('passwordFocus')).toBe(false)
    usernameHolder.simulate('focus')
    expect(setPassword.state('passwordFocus')).toBe(true)
    usernameHolder.simulate('blur')
    expect(setPassword.state('passwordFocus')).toBe(false)

    expect(setPassword.state('confirmFocus')).toBe(false)
    inputs.at(1).simulate('focus')
    expect(setPassword.state('confirmFocus')).toBe(true)
    inputs.at(1).simulate('blur')
    expect(setPassword.state('confirmFocus')).toBe(false)
  })

  it('shows a tooltip', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')
    let tooltip = setPassword.find('Tooltip')
    expect(tooltip.length).toBe(0)
    inputs.at(0).simulate('focus')
    tooltip = setPassword.find('Tooltip')
    expect(tooltip.length).toBe(1)
  })

  it('validates the password', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'invalid_password'}})
    expect(setPassword.state('passwordValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(setPassword.state('passwordValid')).toBe(true)
  })

  it('does not compare when password is invalid', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'invalid_password'}})
    inputs.at(1).simulate('change', {target: {value: 'invalid_password'}})
    expect(setPassword.state('confirmValid')).toBe(false)
  })

  it('does not give a match if password is valid but does not match confirm', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(0).simulate('change', {target: {value: 'different_password'}})
    expect(setPassword.state('confirmValid')).toBe(false)
  })

  it('give a valid match when password is valid and matches confirm', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    const inputs = setPassword.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(1).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(setPassword.state('confirmValid')).toBe(true)
  })
})
