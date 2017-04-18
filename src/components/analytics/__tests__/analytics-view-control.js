import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../analytics-view-control')
import AnalyticsViewControl from '../analytics-view-control'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalyticsViewControl', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (account = 1, storage = 1) => {
      props = {
        intl: intlMaker(),
        activeAccount: new Immutable.Map(),
        activeGroup: new Immutable.Map(),
        activeTab: "test",
        location: {
        },
        params: {
          brand: 'udn',
          account: account,
          group: 1,
          storage: storage
        },
        router: {}
      }
      return shallow(<AnalyticsViewControl {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render ButtonToolbar', () => {
    expect(subject().find('ButtonToolbar').length).toBe(1)
  })

  it('should not render ButtonToolbar if there is no account', () => {
    expect(subject(null).find('ButtonToolbar').length).toBe(0)
  })

  it('should render Storage name', () => {
    expect(subject(1).find('TruncatedTitle').length).toBe(1)
  })

  it('should render AccountSelector if there is no storage', () => {
    expect(subject(1, null).find('AccountSelector').length).toBe(0)
  })
})
