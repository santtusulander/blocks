import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../chart-type.jsx')
import ChartType from '../chart-type.jsx'

describe('FilterChartType', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ChartType/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
