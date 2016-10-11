import React, { Component } from 'react'
import { shallow } from 'enzyme'

jest.autoMockOff()
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
    // expect(passwordFields.find('PasswordFields').length).toBe(1)
  })
})
