import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../chart-type.jsx')
const ChartType = require('../chart-type.jsx')

describe('FilterChartType', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ChartType/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
