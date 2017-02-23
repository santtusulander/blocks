import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

jest.unmock('../analytics-link.jsx')
import AnalyticsLink from '../analytics-link'

describe('AnalyticsLink', () => {
  it('should exist', () => {
    const subject = shallow(<AnalyticsLink url={jest.fn()} />)
    expect(subject.length).toBe(1)
  })
})
