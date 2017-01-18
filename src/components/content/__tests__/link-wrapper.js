import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

jest.unmock('../link-wrapper.jsx')
import LinkWrapper from '../link-wrapper'

describe('AnalyticsLink', () => {
  it('should exist', () => {
    const subject = shallow(<LinkWrapper />)
    expect(subject.length).toBe(1)
  })

  it('should not show link if disabled', () => {
    const subject = shallow(<LinkWrapper disableLinkTo={true} />)
    expect(subject.find('Link').length).toBe(0)
    expect(subject.length).toBe(1)
  })
})
