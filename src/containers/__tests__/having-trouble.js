import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../having-trouble.jsx')
import { HavingTrouble } from '../having-trouble.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.fn(),
    fetchUser: jest.fn().mockImplementation(() => Promise.resolve()),
    logIn: jest.fn().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    }),
    checkToken: jest.fn().mockImplementation(() => {
      return {payload: {token:null}}
    }),
    saveName: jest.fn()
  }
}

const subject = () => {
  return (
    <HavingTrouble
      userActions={userActionsMaker({})}
      intl={intlMaker()}
      fetching={false}
    />
  )
}

describe('HavingTrouble', () => {
  it('should exist', () => {
    const havingTrouble = shallow(
      subject()
    )
    expect(havingTrouble.length).toBe(1)
  })

  it('should have 1 button', () => {
    const havingTrouble = shallow(
      subject()
    )
    expect(havingTrouble.find('Button').length).toBe(1)
  })
})
