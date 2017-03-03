import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../comparison-bars')
import ComparisonBars from '../comparison-bars'

const subject = shallow(
  <ComparisonBars />
)

describe('ComparisonBars', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
