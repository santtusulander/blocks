import React from 'react'
import { shallow } from 'enzyme'
import d3 from 'd3'
import moment from 'moment'

jest.unmock('../time-axis-labels')
import TimeAxisLabels from '../time-axis-labels'

describe('TimeAxisLabels', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        height: 10,
        padding: 10,
        xScale: d3.time.scale()
          .domain([moment().subtract(4, 'months'), moment()])
          .range([
            0,
            10
          ]),
        showHours: true
      }
      return shallow(<TimeAxisLabels {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
