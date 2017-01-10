import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../analytics-container')
import AnalyticsContainer from '../analytics-container'

jest.mock('../../../util/status-codes', () => {
  return {
    getAnalysisErrorCodes: () => [],
    getAnalysisStatusCodes: () => []
  }
})

jest.mock('../../../constants/analytics-tab-config', () => {
  return [{
    key: 'foo',
    get: jest.fn()
  }]
})

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn(),
    fetchAccounts: jest.fn()
  }
}

function filtersActionsMaker() {
  return {
    resetFilters: jest.fn()
  }
}

function groupActionsMaker() {
  return {
    fetchGroup: jest.fn(),
    fetchGroups: jest.fn()
  }
}

function propertyActionsMaker() {
  return {
    fetchHost: jest.fn(),
    fetchHosts: jest.fn()
  }
}

describe('AnalyticsContainer', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        accountActions: accountActionsMaker(),
        filtersActions: filtersActionsMaker(),
        groupActions: groupActionsMaker(),
        location: { pathname: 'foobar' },
        params: { brand: 'foo', account: 'bar', group: 'zyx', property: 'qwe' },
        propertyActions: propertyActionsMaker()
      }
      return shallow(<AnalyticsContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
