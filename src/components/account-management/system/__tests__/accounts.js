import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../accounts.jsx')
import AccountList from '../accounts.jsx'

const router = {
  setRouteLeaveHook: jest.fn()
}

const accountActions = {
  fetchAccounts: jest.fn(),
  startFetching: jest.fn()
}

const uiActions = {
  hideInfoDialog: jest.fn(),
  showInfoDialog: jest.fn()
}

const accounts = Immutable.fromJS([
  {
    name: 'foo',
    provider_type: 1,
    services: [
      {
        service_id: 1
      }
    ]
  }
])

const providerTypes = Immutable.fromJS({
  type: {
    id: 1
  }
})

const servicesInfo = Immutable.fromJS({
  service: {
    id: 1
  }
})

const params = { brand: 'foo', account: 'bar' }

describe('AccountList', () => {
  let error, props, subject = null

  beforeEach(() => {
    subject = () => {
      props = {
        accountActions,
        accounts,
        editAccount: jest.fn(),
        fetchServiceInfo: jest.fn(),
        params,
        providerTypes,
        router,
        servicesInfo,
        uiActions
      }
      return shallow(<AccountList {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  })
})
