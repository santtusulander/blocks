import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../export')
import AnalyticsExport from '../export'

describe('AnalyticsExport', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsExport {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
