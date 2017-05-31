import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../purge-status.jsx')
import PurgeHistoryReport from '../purge-status'

jest.mock('../../../../util/helpers', () => ({
  getSortData: val => val,
  unixTimestampToDate: time => time
}))

function intlMaker() {
  return {
    formatMessage: jest.fn(),
    formatDate: jest.fn()
  }
}

function routerMaker() {
  return {
    isActive: val => val
  }
}

const historyData = Immutable.fromJS([
  { status: 'foo' },
  { status: 'bar' }
])

const params = { brand: 'foo', account: 'bar', group: 'zyx', property: 'qwe' }

describe('PurgeHistoryReport', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        // currentUser: Immutable.Map(),
        // deleteProperty: jest.fn(),
        intl: intlMaker(),
        // params,
        // router: routerMaker(),
        // togglePurge: jest.fn()
        historyData
      }
      return shallow(<PurgeHistoryReport {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

})
