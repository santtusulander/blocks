import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../details.jsx')
import Account from '../details.jsx'

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
      <Account router={fakeRouter}
        fields={fakeFields}
        intl={intlMaker()}
        fetchServiceInfo={ jest.fn() }
        fetchAccountDetails={ jest.fn() }
        accountStartFetching={ jest.fn() }
        params={ {brand: 'udn', account: 1} }
      />
    )
    expect(details.length).toBe(1)
  })
})
