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

describe('PasswordFields', () => {
  it('should exist', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()}/>)
    expect(passwordFields).toBeDefined()
  })

  it('updates password and confirmation state', () => {
    const passwordFields = shallow(<PasswordFields intl={intlMaker()}/>)
    let inputs = passwordFields.find('input')
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

  xit('validates the password length requirement', () => {

  })

  xit('validates the password uppercase requirement', () => {

  })

  xit('validates the password number requirement', () => {

  })

  xit('validates the password special character requirement', () => {

  })

  xit('validates the password with all the requirements', () => {

  })
})
