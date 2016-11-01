import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../stacked-by-time-summary.jsx')

jest.mock('../../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  formatOutput: bytes => bytes
}})

import StackedByTimeSummary from '../stacked-by-time-summary.jsx'


const fakeData = {
  "traffic": {
    "bytes": 446265804980374,
    "bytes_net_on": 352569123057670,
    "bytes_net_off": 93696681922704,
    "detail": [
      {
        "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
        "bytes": 92020173697866,
        "bytes_net_on": 71856580682504,
        "bytes_net_off": 20163593015362
      },
      {
        "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
        "bytes": 99672709053865,
        "bytes_net_on": 76848354018252,
        "bytes_net_off": 22824355035613
      },
      {
        "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
        "bytes": 94821186769899,
        "bytes_net_on": 72941835769369,
        "bytes_net_off": 21879351000530
      },
      {
        "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
        "bytes": 117441291619312,
        "bytes_net_on": 90477417340581,
        "bytes_net_off": 26963874278731
      },
      {
        "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
        "bytes": 81546375702611,
        "bytes_net_on": 62160286504951,
        "bytes_net_off": 19386089197660
      },
      {
        "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
        "bytes": 117341539984300,
        "bytes_net_on": 90364165873239,
        "bytes_net_off": 26977374111061
      },
      {
        "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
        "bytes": 94064934029131,
        "bytes_net_on": 72989086766237,
        "bytes_net_off": 21075847262894
      },
      {
        "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
        "bytes": 93196929110225,
        "bytes_net_on": 72133332220394,
        "bytes_net_off": 21063596889831
      }
    ]
  }
}

describe('StackedByTimeSummary', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        dataKey: "bytes",
        data: fakeData
      }
      return shallow(<StackedByTimeSummary {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
