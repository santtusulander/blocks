import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../account.jsx')
import Account from '../account.jsx'

const fakeRouter = {
  setRouteLeaveHook: jest.fn()
}

const fakeFields = {
  accountName: {value: "foo"},
  accountType: {value: 2}
}

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountManagementAccountDetails', () => {
  it('should exist', () => {
    const details = shallow(
      <Account router={fakeRouter} fields={fakeFields} intl={intlMaker()} />
    )
    expect(details.length).toBe(1)
  })
})
