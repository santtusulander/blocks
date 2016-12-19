import React, { Component } from 'react'
import { shallow } from 'enzyme'

// jest.autoMockOff()
jest.dontMock('../password-fields.jsx')
const PasswordFields = require('../password-fields.jsx').PasswordFields

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const passwordFields = shallow(<PasswordFields intl={intlMaker()}/>)
const inputs = passwordFields.find('FormControl')

describe('PasswordFields', () => {
  it('should exist', () => {
    expect(passwordFields).toBeDefined()
  })

  it('updates password and confirmation state', () => {
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    inputs.at(1).simulate('change', {target: {value: 'bbb'}})
    expect(passwordFields.state('password')).toBe('aaa')
    expect(passwordFields.state('confirm')).toBe('bbb')
  })

  it('can show / hide the initial password', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} stackedPassword={true}/>)
    expect(passwordFields.state('passwordVisible')).toBe(false)
    passwordFields.instance().togglePasswordVisibility()
    expect(passwordFields.state('passwordVisible')).toBe(true)
  })

  it('can show / hide the confirmation password', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} stackedPassword={true}/>)
    expect(passwordFields.state('confirmVisible')).toBe(false)
    passwordFields.instance().toggleConfirmVisibility()
    expect(passwordFields.state('confirmVisible')).toBe(true)
  })

  it('toggles active class when focused and blurred', () => {
    const usernameHolder = inputs.at(0)
    expect(passwordFields.state('passwordFocus')).toBe(false)
    usernameHolder.simulate('focus')
    expect(passwordFields.state('passwordFocus')).toBe(true)
    usernameHolder.simulate('blur')
    expect(passwordFields.state('passwordFocus')).toBe(false)

    const passwordHolder = inputs.at(1)
    expect(passwordFields.state('confirmFocus')).toBe(false)
    inputs.at(1).simulate('focus')
    expect(passwordFields.state('confirmFocus')).toBe(true)
    inputs.at(1).simulate('blur')
    expect(passwordFields.state('confirmFocus')).toBe(false)
  })

  it('shows an interactive password requirement tooltip', () => {
    let tooltip = passwordFields.find('Tooltip')
    expect(tooltip.length).toBe(0)
    inputs.at(0).simulate('focus')
    tooltip = passwordFields.find('Tooltip')
    expect(tooltip.length).toBe(1)
  })

  it('validates the password length requirement', () => {
    inputs.at(0).simulate('change', {target: {value: 'shortpw'}})
    expect(passwordFields.state('passwordLengthValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'verylongpw'}})
    expect(passwordFields.state('passwordLengthValid')).toBe(true)
  })

  it('validates the password uppercase requirement', () => {
    inputs.at(0).simulate('change', {target: {value: 'notuppercasepw'}})
    expect(passwordFields.state('passwordUppercaseValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'Uppercasepw'}})
    expect(passwordFields.state('passwordUppercaseValid')).toBe(true)
  })

  it('validates the password number requirement', () => {
    inputs.at(0).simulate('change', {target: {value: 'nonumberpw'}})
    expect(passwordFields.state('passwordNumberValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'number1pw'}})
    expect(passwordFields.state('passwordNumberValid')).toBe(true)
  })

  it('validates the password special character requirement', () => {
    inputs.at(0).simulate('change', {target: {value: 'nospecialcharpw'}})
    expect(passwordFields.state('passwordSpecialCharValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'specialcharpw!'}})
    expect(passwordFields.state('passwordSpecialCharValid')).toBe(true)
  })

  it('validates the password with all the requirements', () => {
    inputs.at(0).simulate('change', {target: {value: 'notvalid'}})
    expect(passwordFields.state('passwordValid')).toBe(false)
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(passwordFields.state('passwordValid')).toBe(true)
  })

  it('does not compare when password is invalid', () => {
    inputs.at(0).simulate('change', {target: {value: 'invalid_password'}})
    inputs.at(1).simulate('change', {target: {value: 'invalid_password'}})
    expect(passwordFields.state('confirmValid')).toBe(false)
  })

  it('does not give a match if password is valid but does not match confirm', () => {
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(1).simulate('change', {target: {value: 'different_password'}})
    expect(passwordFields.state('confirmValid')).toBe(false)
  })

  it('gives a valid match when password is valid and matches confirm', () => {
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(1).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(passwordFields.state('confirmValid')).toBe(true)
  })

  it('calls redux-form onChange prop on password change', () => {
    const onChange = jest.fn()
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} onChange={onChange}/>)
    const inputs = passwordFields.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(onChange).toHaveBeenCalled()
  })

  it('calls changePassword prop with false paramter when passwords do not match', () => {
    const changePassword = jest.fn()
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} changePassword={changePassword}/>)
    const inputs = passwordFields.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(1).simulate('change', {target: {value: 'different_password'}})
    expect(changePassword).toHaveBeenCalledWith(false)
  })

  it('calls changePassword prop with true paramter when passwords do match', () => {
    const changePassword = jest.fn()
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} changePassword={changePassword}/>)
    const inputs = passwordFields.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'V@lid_P@55word'}})
    inputs.at(1).simulate('change', {target: {value: 'V@lid_P@55word'}})
    expect(changePassword).toHaveBeenCalledWith(true)
  })
})
