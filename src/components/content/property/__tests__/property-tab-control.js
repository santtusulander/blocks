import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../property-tab-control.jsx')
import PropertyTabControl from '../property-tab-control'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('PropertyTabControl', () => {
  it('should exist', () => {
    const subject = shallow(
      <PropertyTabControl intl={intlMaker()} location={{}} />
    )
    expect(subject.length).toBe(1)
  })
})
