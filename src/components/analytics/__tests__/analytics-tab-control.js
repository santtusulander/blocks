import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../analytics-tab-control')
import AnalyticsTabControl from '../analytics-tab-control'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalyticsTabControl', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<AnalyticsTabControl {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
