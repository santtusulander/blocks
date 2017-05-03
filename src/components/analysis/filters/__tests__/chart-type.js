import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../chart-type.jsx')
import ChartType from '../chart-type.jsx'

describe('FilterChartType', () => {
  it('should exist', () => {
    expect(shallow(<ChartType/>)).toBeTruthy()
  })
})
