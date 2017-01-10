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
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<AnalyticsViewControl {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
