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
const inputs = passwordFields.find('input')

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
})
