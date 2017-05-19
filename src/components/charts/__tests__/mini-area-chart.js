import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.unmock('../mini-area-chart.jsx')
import MiniAreaChart from '../mini-area-chart.jsx'

const area = [
  {
    "dataKey": "bytes",
    "name": "MiniChart",
    "className": "mini-chart-bytes",
    "stackId": 1
  }
]
const fakeData = [
  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
]

describe('MiniAreaChart', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        areas: area,
        data: fakeData
      }
      return shallow(<MiniAreaChart {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
