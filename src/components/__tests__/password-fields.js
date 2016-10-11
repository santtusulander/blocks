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

  xit('can be passed a stackedPassword prop for a stacked input layout', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} stackedPassword={true}/>)

  })

  xit('can be passed a inlinePassword prop for an inline input layout', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()} inlinePassword={true}/>)

  })

  xit('shows an interactive password requirement tooltip', () => {

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
    inputs.at(0).simulate('change', {target: {value: 'Has4requirements!'}})
    expect(passwordFields.state('passwordValid')).toBe(true)
  })
})
