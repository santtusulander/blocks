import React from 'react'
import { Tooltip } from 'react-bootstrap'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

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
  const fakeRoute = { path: '/reset-password' }
  const fakeLocation = { query: { email: 'a@b.c' } }
  const fakeRouter = {}
  const fakeParams = { token: '1234567890' }

  it('should exist', () => {
    const setPassword = shallow(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={fakeRoute}
        router={fakeRouter}
        params={fakeParams}
      />
    )
    expect(setPassword).toBeTruthy();
  })

  it('sets the validPassword state to false when the isValidPassword paramter is false', () => {
    const setPassword = shallow(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={fakeRoute}
        router={fakeRouter}
        params={fakeParams}
      />
    )
    setPassword.instance().changePassword(false)
    expect(setPassword.state('validPassword')).toBe(false)
  })

  it('sets the validPassword state to true when the isValidPassword paramter is true', () => {
    const setPassword = shallow(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={fakeRoute}
        router={fakeRouter}
        params={fakeParams}
      />
    )
    setPassword.instance().changePassword(true)
    expect(setPassword.state('validPassword')).toBe(true)
  })

  it('should act as both set AND reset password page', () => {
    const setPassword = shallow(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={{path: '/set-password'}}
        router={fakeRouter}
        params={fakeParams}
      />
    )
    const resetPassword = shallow(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={{path: '/reset-password'}}
        router={fakeRouter}
        params={fakeParams}
      />
    )

    expect(setPassword.state('reset')).toBe(false)
    expect(resetPassword.state('reset')).toBe(true)
  })

  it('displays when email and token are specified', () => {
    const router = { push: jest.fn() }
    const setPassword = mount(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={fakeRoute}
        router={router}
        params={fakeParams}
      />
    )

    expect(router.push.mock.calls.length).toBe(0)
  })

  it('redirects to login page if token is not present', () => {
    const router = { push: jest.fn() }
    const setPassword = mount(
      <SetPassword
        userActions={userActionsMaker({})}
        location={fakeLocation}
        route={fakeRoute}
        router={router}
        params={{}}
      />
    )

    expect(router.push.mock.calls.length).toBe(1)
    expect(router.push.mock.calls[0][0]).toBe('/login')
  })

  it('redirects to login page if email is not present', () => {
    const router = { push: jest.fn() }
    const setPassword = mount(
      <SetPassword
        userActions={userActionsMaker({})}
        location={{query: {}}}
        route={fakeRoute}
        router={router}
        params={{token: '1234567890'}}
      />
    )

    expect(router.push.mock.calls.length).toBe(1)
    expect(router.push.mock.calls[0][0]).toBe('/login')
  })
})
