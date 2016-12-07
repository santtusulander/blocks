import React from 'react'
import { Tooltip } from 'react-bootstrap'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.mock('../../util/routes', () => {
  return {
    getContentUrl: jest.fn(),
    matchesRegexp: jest.fn()
  }
})

jest.unmock('../password/set-password.jsx')
jest.unmock('../../redux/modules/filters')
import { SetPassword } from '../password/set-password.jsx'

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
