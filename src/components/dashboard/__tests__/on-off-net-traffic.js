import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../on-off-net-traffic.jsx')
import OnOffNetTraffic from '../on-off-net-traffic.jsx'

const fakeData = [
  {
    "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
    "total": 92020173697866,
    "net_on": {
      "bytes": 71856580682504,
      "percent_total": 0.7809
    },
    "net_off": {
      "bytes": 20163593015362,
      "percent_total": 0.2191
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
    "total": 99672709053865,
    "net_on": {
      "bytes": 76848354018252,
      "percent_total": 0.771
    },
    "net_off": {
      "bytes": 22824355035613,
      "percent_total": 0.229
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
    "total": 94821186769899,
    "net_on": {
      "bytes": 72941835769369,
      "percent_total": 0.7693
    },
    "net_off": {
      "bytes": 21879351000530,
      "percent_total": 0.2307
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
    "total": 117441291619312,
    "net_on": {
      "bytes": 90477417340581,
      "percent_total": 0.7704
    },
    "net_off": {
      "bytes": 26963874278731,
      "percent_total": 0.2296
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
    "total": 81546375702611,
    "net_on": {
      "bytes": 62160286504951,
      "percent_total": 0.7623
    },
    "net_off": {
      "bytes": 19386089197660,
      "percent_total": 0.2377
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
    "total": 117341539984300,
    "net_on": {
      "bytes": 90364165873239,
      "percent_total": 0.7701
    },
    "net_off": {
      "bytes": 26977374111061,
      "percent_total": 0.2299
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
    "total": 94064934029131,
    "net_on": {
      "bytes": 72989086766237,
      "percent_total": 0.7759
    },
    "net_off": {
      "bytes": 21075847262894,
      "percent_total": 0.2241
    }
  },
  {
    "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
    "total": 93196929110225,
    "net_on": {
      "bytes": 72133332220394,
      "percent_total": 0.774
    },
    "net_off": {
      "bytes": 21063596889831,
      "percent_total": 0.226
    }
  }
]

describe('OnOffNetTraffic', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        dataKey: "bytes",
        data: fakeData
      }
      return shallow(<OnOffNetTraffic {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
