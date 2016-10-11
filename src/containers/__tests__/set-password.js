import React from 'react'
import { Tooltip } from 'react-bootstrap'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.mock('../../util/helpers', () => {
  return {
    getContentUrl: jest.genMockFunction()
      .mockImplementation(val => '/path/after/login')
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

  it('sets the validPassword state to false when the isValidPassword paramter is false', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    setPassword.instance().changePassword(false)
    expect(setPassword.state('validPassword')).toBe(false)
  })

  it('sets the validPassword state to true when the isValidPassword paramter is true', () => {
    const setPassword = shallow(
      <SetPassword userActions={userActionsMaker({})}/>
    )
    setPassword.instance().changePassword(true)
    expect(setPassword.state('validPassword')).toBe(true)
  })
})
