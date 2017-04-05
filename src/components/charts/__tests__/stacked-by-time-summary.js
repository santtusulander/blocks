import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../stacked-by-time-summary.jsx')

jest.mock('../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  separateUnit: bytes => bytes
}})

import StackedByTimeSummary from '../stacked-by-time-summary.jsx'

describe('StackedByTimeSummary', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        dataKey: "bytes",
        datasetAArray: [
          {
            "bytes": 71856580682504,
            "timestamp": "2016-05-26T19:17:01.000Z"
          },
          {
            "bytes": 76848354018252,
            "timestamp": "2016-05-26T20:17:01.000Z"
          },
          {
            "bytes": 72941835769369,
            "timestamp": "2016-05-26T21:17:01.000Z"
          },
          {
            "bytes": 90477417340581,
            "timestamp": "2016-05-26T22:17:01.000Z"
          },
          {
            "bytes": 62160286504951,
            "timestamp": "2016-05-26T23:17:01.000Z"
          },
          {
            "bytes": 90364165873239,
            "timestamp": "2016-05-27T00:17:01.000Z"
          },
          {
            "bytes": 72989086766237,
            "timestamp": "2016-05-27T01:17:01.000Z"
          },
          {
            "bytes": 72133332220394,
            "timestamp": "2016-05-27T02:17:01.000Z"
          }
        ],
        datasetALabel: "On-Net",
        datasetAUnit: "%",
        datasetAValue: "71",
        totalDatasetUnit: "TB",
        totalDatasetValue: "446"
      }
      return shallow(<StackedByTimeSummary {...props} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
