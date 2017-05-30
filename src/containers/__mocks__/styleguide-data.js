import Immutable from 'immutable'

export const cityData = Immutable.fromJS([
  {
    "name": "daejeon",
    "percent_change": 0.5567,
    "percent_total": 0.0864,
    "historical_total": 1404256487825,
    "total": 2186010027527,
    "requests": 8744,
    "country": "KOR",
    "region": "30",
    "lat": 36.3261,
    "lon": 127.4299,
    "bits_per_second": 8800367,
    "average_bits_per_second": 8800362,
    "average_bytes": 3960163093
  }
])

export const filterCheckboxOptions = Immutable.fromJS([
  { value: 'link1', label: 'Property 1' },
  { value: 'link2', label: 'Property 2' },
  { value: 'link3', label: 'Property 3' },
  { value: 'link4', label: 'Property 4' },
  { value: 'link5', label: 'Property 5' },
  { value: 'link6', label: 'Property 6' },
  { value: 'link7', label: 'Property 7' },
  { value: 'link8', label: 'Property 8' },
  { value: 'link9', label: 'Property 9' }
])

export const spDashboardData = {
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

export const countryData = Immutable.fromJS([
  {
    "name": "Hong Kong",
    "bits_per_second": 2801215741,
    "code": "HKG",
    "total": 484049729862220
  },
  {
    "name": "Japan",
    "bits_per_second": 1011356667,
    "code": "JPN",
    "total": 174762305623425
  },
  {
    "name": "Korea, Republic Of",
    "bits_per_second": 500033048,
    "code": "KOR",
    "total": 86405648211184
  },
  {
    "name": "Malaysia",
    "bits_per_second": 472250782,
    "code": "MYS",
    "total": 81604876012993
  }
])

export const multiOptionSelectorOptions = [
  {
    label: 'Service 1',
    options: [
      {label: 'Option 1-1', value: 1},
      {label: 'Option 1-2', value: 2},
      {label: 'Option 1-3', value: 3}
    ],
    value: 1
  },
  {
    label: 'Service 2',
    options: [
      {label: 'Option 2-1', value: 1},
      {label: 'Option 2-2', value: 2},
      {label: 'Option 2-3', value: 3}
    ],
    value: 2
  }
]

export const typeaheadOptions = [
  {id: 'BY', label: 'Belarus'},
  {id: 'CA', label: 'Canada'},
  {id: 'FI', label: 'Finland'},
  {id: 'DE', label: 'Germany'},
  {id: 'SE', label: 'Sweden'},
  {id: 'UA', label: 'Ukraine'},
  {id: 'US', label: 'United States'}
]

export const miniChartKPIData = [
  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
]

export const storageKPIData = [
  {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
  {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
  {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
  {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
  {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
  {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
  {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
]

export const starburstPrimaryData = Immutable.fromJS([
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-19T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-18T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-17T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-16T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-15T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-14T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-13T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-12T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T21:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T20:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-05-11T00:00:00.000Z"
  },
  {
    "bits_per_second": 3535096155,
    "bytes": 1590793269866,
    "timestamp": "2017-05-10T23:00:00.000Z"
  },
  {
    "bits_per_second": 3656027548,
    "bytes": 1645212396650,
    "timestamp": "2017-05-10T22:00:00.000Z"
  },
  {
    "bits_per_second": 3852039746,
    "bytes": 1733417885710,
    "timestamp": "2017-05-10T21:00:00.000Z"
  },
  {
    "bits_per_second": 3844588914,
    "bytes": 1730065011215,
    "timestamp": "2017-05-10T20:00:00.000Z"
  },
  {
    "bits_per_second": 3512170722,
    "bytes": 1580476824902,
    "timestamp": "2017-05-10T19:00:00.000Z"
  },
  {
    "bits_per_second": 3415884093,
    "bytes": 1537147841681,
    "timestamp": "2017-05-10T18:00:00.000Z"
  },
  {
    "bits_per_second": 3527072149,
    "bytes": 1587182467101,
    "timestamp": "2017-05-10T17:00:00.000Z"
  },
  {
    "bits_per_second": 3328194457,
    "bytes": 1497687505838,
    "timestamp": "2017-05-10T16:00:00.000Z"
  },
  {
    "bits_per_second": 3181471861,
    "bytes": 1431662337357,
    "timestamp": "2017-05-10T15:00:00.000Z"
  },
  {
    "bits_per_second": 2955656961,
    "bytes": 1330045632576,
    "timestamp": "2017-05-10T14:00:00.000Z"
  },
  {
    "bits_per_second": 2212873845,
    "bytes": 995793230325,
    "timestamp": "2017-05-10T13:00:00.000Z"
  },
  {
    "bits_per_second": 2015715421,
    "bytes": 907071939239,
    "timestamp": "2017-05-10T12:00:00.000Z"
  },
  {
    "bits_per_second": 1890198833,
    "bytes": 850589474660,
    "timestamp": "2017-05-10T11:00:00.000Z"
  },
  {
    "bits_per_second": 1778437552,
    "bytes": 800296898228,
    "timestamp": "2017-05-10T10:00:00.000Z"
  },
  {
    "bits_per_second": 2231214097,
    "bytes": 1004046343671,
    "timestamp": "2017-05-10T09:00:00.000Z"
  },
  {
    "bits_per_second": 2239811248,
    "bytes": 1007915061712,
    "timestamp": "2017-05-10T08:00:00.000Z"
  },
  {
    "bits_per_second": 2031190166,
    "bytes": 914035574903,
    "timestamp": "2017-05-10T07:00:00.000Z"
  },
  {
    "bits_per_second": 2150975290,
    "bytes": 967938880283,
    "timestamp": "2017-05-10T06:00:00.000Z"
  },
  {
    "bits_per_second": 2325781483,
    "bytes": 1046601667374,
    "timestamp": "2017-05-10T05:00:00.000Z"
  },
  {
    "bits_per_second": 2524659255,
    "bytes": 1136096664573,
    "timestamp": "2017-05-10T04:00:00.000Z"
  },
  {
    "bits_per_second": 2909805879,
    "bytes": 1309412645665,
    "timestamp": "2017-05-10T03:00:00.000Z"
  },
  {
    "bits_per_second": 3135620931,
    "bytes": 1411029418734,
    "timestamp": "2017-05-10T02:00:00.000Z"
  },
  {
    "bits_per_second": 3164277811,
    "bytes": 1423925014874,
    "timestamp": "2017-05-10T01:00:00.000Z"
  },
  {
    "bits_per_second": 3897890621,
    "bytes": 1754050779632,
    "timestamp": "2017-05-10T00:00:00.000Z"
  },
  {
    "bits_per_second": 3354558655,
    "bytes": 1509551394942,
    "timestamp": "2017-05-09T23:00:00.000Z"
  },
  {
    "bits_per_second": 3464027330,
    "bytes": 1558812298562,
    "timestamp": "2017-05-09T22:00:00.000Z"
  },
  {
    "bits_per_second": 3652015632,
    "bytes": 1643407034435,
    "timestamp": "2017-05-09T21:00:00.000Z"
  },
  {
    "bits_per_second": 3640552973,
    "bytes": 1638248838035,
    "timestamp": "2017-05-09T20:00:00.000Z"
  },
  {
    "bits_per_second": 3469185487,
    "bytes": 1561133469194,
    "timestamp": "2017-05-09T19:00:00.000Z"
  },
  {
    "bits_per_second": 3331633293,
    "bytes": 1499234981923,
    "timestamp": "2017-05-09T18:00:00.000Z"
  },
  {
    "bits_per_second": 3292659963,
    "bytes": 1481696983328,
    "timestamp": "2017-05-09T17:00:00.000Z"
  },
  {
    "bits_per_second": 3102952358,
    "bytes": 1396328560945,
    "timestamp": "2017-05-09T16:00:00.000Z"
  },
  {
    "bits_per_second": 2866247771,
    "bytes": 1289811497004,
    "timestamp": "2017-05-09T15:00:00.000Z"
  },
  {
    "bits_per_second": 2674820767,
    "bytes": 1203669345006,
    "timestamp": "2017-05-09T14:00:00.000Z"
  },
  {
    "bits_per_second": 2733280177,
    "bytes": 1229976079609,
    "timestamp": "2017-05-09T13:00:00.000Z"
  },
  {
    "bits_per_second": 2530963651,
    "bytes": 1138933643053,
    "timestamp": "2017-05-09T12:00:00.000Z"
  },
  {
    "bits_per_second": 1752073164,
    "bytes": 788432923587,
    "timestamp": "2017-05-09T11:00:00.000Z"
  },
  {
    "bits_per_second": 1631715076,
    "bytes": 734271784130,
    "timestamp": "2017-05-09T10:00:00.000Z"
  },
  {
    "bits_per_second": 1624264471,
    "bytes": 730919011856,
    "timestamp": "2017-05-09T09:00:00.000Z"
  },
  {
    "bits_per_second": 1611655360,
    "bytes": 725244911959,
    "timestamp": "2017-05-09T08:00:00.000Z"
  },
  {
    "bits_per_second": 1965279621,
    "bytes": 884375829390,
    "timestamp": "2017-05-09T07:00:00.000Z"
  },
  {
    "bits_per_second": 2073028992,
    "bytes": 932863046347,
    "timestamp": "2017-05-09T06:00:00.000Z"
  },
  {
    "bits_per_second": 2020300515,
    "bytes": 909135231920,
    "timestamp": "2017-05-09T05:00:00.000Z"
  },
  {
    "bits_per_second": 2227775334,
    "bytes": 1002498900375,
    "timestamp": "2017-05-09T04:00:00.000Z"
  },
  {
    "bits_per_second": 2682271346,
    "bytes": 1207022105909,
    "timestamp": "2017-05-09T03:00:00.000Z"
  },
  {
    "bits_per_second": 2881722308,
    "bytes": 1296775038664,
    "timestamp": "2017-05-09T02:00:00.000Z"
  },
  {
    "bits_per_second": 3114415065,
    "bytes": 1401486779233,
    "timestamp": "2017-05-09T01:00:00.000Z"
  },
  {
    "bits_per_second": 3304695803,
    "bytes": 1487113111505,
    "timestamp": "2017-05-09T00:00:00.000Z"
  },
  {
    "bits_per_second": 3458295854,
    "bytes": 1556233134128,
    "timestamp": "2017-05-08T23:00:00.000Z"
  },
  {
    "bits_per_second": 3602725951,
    "bytes": 1621226677764,
    "timestamp": "2017-05-08T22:00:00.000Z"
  },
  {
    "bits_per_second": 3513889996,
    "bytes": 1581250498100,
    "timestamp": "2017-05-08T21:00:00.000Z"
  },
  {
    "bits_per_second": 3493830325,
    "bytes": 1572223646467,
    "timestamp": "2017-05-08T20:00:00.000Z"
  },
  {
    "bits_per_second": 3450272124,
    "bytes": 1552622455906,
    "timestamp": "2017-05-08T19:00:00.000Z"
  },
  {
    "bits_per_second": 3331633345,
    "bytes": 1499235005074,
    "timestamp": "2017-05-08T18:00:00.000Z"
  },
  {
    "bits_per_second": 3328767616,
    "bytes": 1497945427308,
    "timestamp": "2017-05-08T17:00:00.000Z"
  },
  {
    "bits_per_second": 3150522801,
    "bytes": 1417735260516,
    "timestamp": "2017-05-08T16:00:00.000Z"
  },
  {
    "bits_per_second": 2953364105,
    "bytes": 1329013847060,
    "timestamp": "2017-05-08T15:00:00.000Z"
  },
  {
    "bits_per_second": 2748754959,
    "bytes": 1236939731716,
    "timestamp": "2017-05-08T14:00:00.000Z"
  },
  {
    "bits_per_second": 2307441425,
    "bytes": 1038348641067,
    "timestamp": "2017-05-08T13:00:00.000Z"
  },
  {
    "bits_per_second": 2126903551,
    "bytes": 957106598023,
    "timestamp": "2017-05-08T12:00:00.000Z"
  },
  {
    "bits_per_second": 2247835223,
    "bytes": 1011525850271,
    "timestamp": "2017-05-08T11:00:00.000Z"
  },
  {
    "bits_per_second": 2133781255,
    "bytes": 960201564746,
    "timestamp": "2017-05-08T10:00:00.000Z"
  },
  {
    "bits_per_second": 1780730195,
    "bytes": 801328587565,
    "timestamp": "2017-05-08T09:00:00.000Z"
  },
  {
    "bits_per_second": 1773852550,
    "bytes": 798233647351,
    "timestamp": "2017-05-08T08:00:00.000Z"
  },
  {
    "bits_per_second": 1581852452,
    "bytes": 711833603220,
    "timestamp": "2017-05-08T07:00:00.000Z"
  },
  {
    "bits_per_second": 1698771962,
    "bytes": 764447382836,
    "timestamp": "2017-05-08T06:00:00.000Z"
  },
  {
    "bits_per_second": 2117160514,
    "bytes": 952722231497,
    "timestamp": "2017-05-08T05:00:00.000Z"
  },
  {
    "bits_per_second": 2322342663,
    "bytes": 1045054198170,
    "timestamp": "2017-05-08T04:00:00.000Z"
  },
  {
    "bits_per_second": 2741877319,
    "bytes": 1233844793495,
    "timestamp": "2017-05-08T03:00:00.000Z"
  },
  {
    "bits_per_second": 2940182122,
    "bytes": 1323081954792,
    "timestamp": "2017-05-08T02:00:00.000Z"
  },
  {
    "bits_per_second": 2987752272,
    "bytes": 1344488522459,
    "timestamp": "2017-05-08T01:00:00.000Z"
  },
  {
    "bits_per_second": 3189495930,
    "bytes": 1435273168414,
    "timestamp": "2017-05-08T00:00:00.000Z"
  },
  {
    "bits_per_second": 2931011978,
    "bytes": 1318955389986,
    "timestamp": "2017-05-07T23:00:00.000Z"
  },
  {
    "bits_per_second": 3067418038,
    "bytes": 1380338116935,
    "timestamp": "2017-05-07T22:00:00.000Z"
  },
  {
    "bits_per_second": 3411872089,
    "bytes": 1535342440242,
    "timestamp": "2017-05-07T21:00:00.000Z"
  },
  {
    "bits_per_second": 3399263127,
    "bytes": 1529668407353,
    "timestamp": "2017-05-07T20:00:00.000Z"
  },
  {
    "bits_per_second": 2994056730,
    "bytes": 1347325528389,
    "timestamp": "2017-05-07T19:00:00.000Z"
  },
  {
    "bits_per_second": 2863382091,
    "bytes": 1288521940785,
    "timestamp": "2017-05-07T18:00:00.000Z"
  },
  {
    "bits_per_second": 2681125085,
    "bytes": 1206506288027,
    "timestamp": "2017-05-07T17:00:00.000Z"
  },
  {
    "bits_per_second": 2473650098,
    "bytes": 1113142543936,
    "timestamp": "2017-05-07T16:00:00.000Z"
  },
  {
    "bits_per_second": 2474223407,
    "bytes": 1113400532977,
    "timestamp": "2017-05-07T15:00:00.000Z"
  },
  {
    "bits_per_second": 2255285843,
    "bytes": 1014878629388,
    "timestamp": "2017-05-07T14:00:00.000Z"
  },
  {
    "bits_per_second": 1792192809,
    "bytes": 806486763832,
    "timestamp": "2017-05-07T13:00:00.000Z"
  },
  {
    "bits_per_second": 1586437425,
    "bytes": 713896841238,
    "timestamp": "2017-05-07T12:00:00.000Z"
  },
  {
    "bits_per_second": 2054115392,
    "bytes": 924351926270,
    "timestamp": "2017-05-07T11:00:00.000Z"
  },
  {
    "bits_per_second": 1902807903,
    "bytes": 856263556146,
    "timestamp": "2017-05-07T10:00:00.000Z"
  },
  {
    "bits_per_second": 1157732482,
    "bytes": 520979616675,
    "timestamp": "2017-05-07T09:00:00.000Z"
  },
  {
    "bits_per_second": 1148562290,
    "bytes": 516853030478,
    "timestamp": "2017-05-07T08:00:00.000Z"
  },
  {
    "bits_per_second": 1256311693,
    "bytes": 565340261809,
    "timestamp": "2017-05-07T07:00:00.000Z"
  },
  {
    "bits_per_second": 1361195349,
    "bytes": 612537906844,
    "timestamp": "2017-05-07T06:00:00.000Z"
  },
  {
    "bits_per_second": 1559500081,
    "bytes": 701775036667,
    "timestamp": "2017-05-07T05:00:00.000Z"
  },
  {
    "bits_per_second": 1768694271,
    "bytes": 795912422118,
    "timestamp": "2017-05-07T04:00:00.000Z"
  },
  {
    "bits_per_second": 2041506450,
    "bytes": 918677902432,
    "timestamp": "2017-05-07T03:00:00.000Z"
  },
  {
    "bits_per_second": 2252420088,
    "bytes": 1013589039548,
    "timestamp": "2017-05-07T02:00:00.000Z"
  },
  {
    "bits_per_second": 2724683347,
    "bytes": 1226107506156,
    "timestamp": "2017-05-07T01:00:00.000Z"
  },
  {
    "bits_per_second": 2897197011,
    "bytes": 1303738655083,
    "timestamp": "2017-05-07T00:00:00.000Z"
  },
  {
    "bits_per_second": 3371179291,
    "bytes": 1517030681174,
    "timestamp": "2017-05-06T23:00:00.000Z"
  },
  {
    "bits_per_second": 3492110961,
    "bytes": 1571449932235,
    "timestamp": "2017-05-06T22:00:00.000Z"
  },
  {
    "bits_per_second": 3407860166,
    "bytes": 1533537074834,
    "timestamp": "2017-05-06T21:00:00.000Z"
  },
  {
    "bits_per_second": 3419323045,
    "bytes": 1538695370057,
    "timestamp": "2017-05-06T20:00:00.000Z"
  },
  {
    "bits_per_second": 3350546583,
    "bytes": 1507745962547,
    "timestamp": "2017-05-06T19:00:00.000Z"
  },
  {
    "bits_per_second": 3226176303,
    "bytes": 1451779336329,
    "timestamp": "2017-05-06T18:00:00.000Z"
  },
  {
    "bits_per_second": 2838737167,
    "bytes": 1277431725321,
    "timestamp": "2017-05-06T17:00:00.000Z"
  },
  {
    "bits_per_second": 2645590793,
    "bytes": 1190515856987,
    "timestamp": "2017-05-06T16:00:00.000Z"
  },
  {
    "bits_per_second": 2412324736,
    "bytes": 1085546131139,
    "timestamp": "2017-05-06T15:00:00.000Z"
  },
  {
    "bits_per_second": 2202557486,
    "bytes": 991150868547,
    "timestamp": "2017-05-06T14:00:00.000Z"
  },
  {
    "bits_per_second": 2461614481,
    "bytes": 1107726516362,
    "timestamp": "2017-05-06T13:00:00.000Z"
  },
  {
    "bits_per_second": 2270760319,
    "bytes": 1021842143746,
    "timestamp": "2017-05-06T12:00:00.000Z"
  },
  {
    "bits_per_second": 2184790193,
    "bytes": 983155587006,
    "timestamp": "2017-05-06T11:00:00.000Z"
  },
  {
    "bits_per_second": 2042652953,
    "bytes": 919193828977,
    "timestamp": "2017-05-06T10:00:00.000Z"
  },
  {
    "bits_per_second": 1386413304,
    "bytes": 623885986701,
    "timestamp": "2017-05-06T09:00:00.000Z"
  },
  {
    "bits_per_second": 1398449196,
    "bytes": 629302138280,
    "timestamp": "2017-05-06T08:00:00.000Z"
  },
  {
    "bits_per_second": 1732013731,
    "bytes": 779406178937,
    "timestamp": "2017-05-06T07:00:00.000Z"
  },
  {
    "bits_per_second": 1847213864,
    "bytes": 831246238971,
    "timestamp": "2017-05-06T06:00:00.000Z"
  },
  {
    "bits_per_second": 1755512227,
    "bytes": 789980502186,
    "timestamp": "2017-05-06T05:00:00.000Z"
  },
  {
    "bits_per_second": 1953243702,
    "bytes": 878959666039,
    "timestamp": "2017-05-06T04:00:00.000Z"
  },
  {
    "bits_per_second": 2234653013,
    "bytes": 1005593855848,
    "timestamp": "2017-05-06T03:00:00.000Z"
  },
  {
    "bits_per_second": 2458175670,
    "bytes": 1106179051694,
    "timestamp": "2017-05-06T02:00:00.000Z"
  },
  {
    "bits_per_second": 2881149214,
    "bytes": 1296517146127,
    "timestamp": "2017-05-06T01:00:00.000Z"
  },
  {
    "bits_per_second": 3082319547,
    "bytes": 1387043796352,
    "timestamp": "2017-05-06T00:00:00.000Z"
  },
  {
    "bits_per_second": 3171155315,
    "bytes": 1427019891556,
    "timestamp": "2017-05-05T23:00:00.000Z"
  },
  {
    "bits_per_second": 3294379314,
    "bytes": 1482470691367,
    "timestamp": "2017-05-05T22:00:00.000Z"
  },
  {
    "bits_per_second": 3478355793,
    "bytes": 1565260106966,
    "timestamp": "2017-05-05T21:00:00.000Z"
  },
  {
    "bits_per_second": 3475490068,
    "bytes": 1563970530465,
    "timestamp": "2017-05-05T20:00:00.000Z"
  },
  {
    "bits_per_second": 3257698632,
    "bytes": 1465964384308,
    "timestamp": "2017-05-05T19:00:00.000Z"
  },
  {
    "bits_per_second": 3142498808,
    "bytes": 1414124463527,
    "timestamp": "2017-05-05T18:00:00.000Z"
  },
  {
    "bits_per_second": 2908659755,
    "bytes": 1308896889580,
    "timestamp": "2017-05-05T17:00:00.000Z"
  },
  {
    "bits_per_second": 2715513232,
    "bytes": 1221980954261,
    "timestamp": "2017-05-05T16:00:00.000Z"
  },
  {
    "bits_per_second": 2482247262,
    "bytes": 1117011268123,
    "timestamp": "2017-05-05T15:00:00.000Z"
  },
  {
    "bits_per_second": 2271906849,
    "bytes": 1022358082183,
    "timestamp": "2017-05-05T14:00:00.000Z"
  },
  {
    "bits_per_second": 2281649997,
    "bytes": 1026742498635,
    "timestamp": "2017-05-05T13:00:00.000Z"
  },
  {
    "bits_per_second": 2073028983,
    "bytes": 932863042461,
    "timestamp": "2017-05-05T12:00:00.000Z"
  },
  {
    "bits_per_second": 1916563197,
    "bytes": 862453438573,
    "timestamp": "2017-05-05T11:00:00.000Z"
  },
  {
    "bits_per_second": 1795631640,
    "bytes": 808034237829,
    "timestamp": "2017-05-05T10:00:00.000Z"
  },
  {
    "bits_per_second": 1746342191,
    "bytes": 785853985732,
    "timestamp": "2017-05-05T09:00:00.000Z"
  },
  {
    "bits_per_second": 1746342183,
    "bytes": 785853982290,
    "timestamp": "2017-05-05T08:00:00.000Z"
  },
  {
    "bits_per_second": 1514222413,
    "bytes": 681400085655,
    "timestamp": "2017-05-05T07:00:00.000Z"
  },
  {
    "bits_per_second": 1623118048,
    "bytes": 730403121757,
    "timestamp": "2017-05-05T06:00:00.000Z"
  },
  {
    "bits_per_second": 1860395886,
    "bytes": 837178148888,
    "timestamp": "2017-05-05T05:00:00.000Z"
  },
  {
    "bits_per_second": 2069016933,
    "bytes": 931057619695,
    "timestamp": "2017-05-05T04:00:00.000Z"
  },
  {
    "bits_per_second": 2508611357,
    "bytes": 1128875110560,
    "timestamp": "2017-05-05T03:00:00.000Z"
  },
  {
    "bits_per_second": 2706342948,
    "bytes": 1217854326489,
    "timestamp": "2017-05-05T02:00:00.000Z"
  },
  {
    "bits_per_second": 2944193946,
    "bytes": 1324887275726,
    "timestamp": "2017-05-05T01:00:00.000Z"
  },
  {
    "bits_per_second": 3151668747,
    "bytes": 1418250936225,
    "timestamp": "2017-05-05T00:00:00.000Z"
  },
  {
    "bits_per_second": 3285782235,
    "bytes": 1478602005728,
    "timestamp": "2017-05-04T23:00:00.000Z"
  },
  {
    "bits_per_second": 3396970677,
    "bytes": 1528636804558,
    "timestamp": "2017-05-04T22:00:00.000Z"
  },
  {
    "bits_per_second": 3676087292,
    "bytes": 1654239281620,
    "timestamp": "2017-05-04T21:00:00.000Z"
  },
  {
    "bits_per_second": 3670355822,
    "bytes": 1651660120012,
    "timestamp": "2017-05-04T20:00:00.000Z"
  },
  {
    "bits_per_second": 3314439342,
    "bytes": 1491497704026,
    "timestamp": "2017-05-04T19:00:00.000Z"
  },
  {
    "bits_per_second": 3202678060,
    "bytes": 1441205126836,
    "timestamp": "2017-05-04T18:00:00.000Z"
  },
  {
    "bits_per_second": 3184337426,
    "bytes": 1432951841907,
    "timestamp": "2017-05-04T17:00:00.000Z"
  },
  {
    "bits_per_second": 3009531441,
    "bytes": 1354289148282,
    "timestamp": "2017-05-04T16:00:00.000Z"
  },
  {
    "bits_per_second": 2963107314,
    "bytes": 1333398291421,
    "timestamp": "2017-05-04T15:00:00.000Z"
  },
  {
    "bits_per_second": 2764229611,
    "bytes": 1243903324802,
    "timestamp": "2017-05-04T14:00:00.000Z"
  },
  {
    "bits_per_second": 2600313087,
    "bytes": 1170140889210,
    "timestamp": "2017-05-04T13:00:00.000Z"
  },
  {
    "bits_per_second": 2415190475,
    "bytes": 1086835713779,
    "timestamp": "2017-05-04T12:00:00.000Z"
  },
  {
    "bits_per_second": 1984193049,
    "bytes": 892886872241,
    "timestamp": "2017-05-04T11:00:00.000Z"
  },
  {
    "bits_per_second": 1862115407,
    "bytes": 837951933361,
    "timestamp": "2017-05-04T10:00:00.000Z"
  },
  {
    "bits_per_second": 1811679306,
    "bytes": 815255687784,
    "timestamp": "2017-05-04T09:00:00.000Z"
  },
  {
    "bits_per_second": 1819130266,
    "bytes": 818608619769,
    "timestamp": "2017-05-04T08:00:00.000Z"
  },
  {
    "bits_per_second": 2169315646,
    "bytes": 976192040911,
    "timestamp": "2017-05-04T07:00:00.000Z"
  },
  {
    "bits_per_second": 2266748587,
    "bytes": 1020036864258,
    "timestamp": "2017-05-04T06:00:00.000Z"
  },
  {
    "bits_per_second": 1922294451,
    "bytes": 865032503015,
    "timestamp": "2017-05-04T05:00:00.000Z"
  },
  {
    "bits_per_second": 2127476845,
    "bytes": 957364580091,
    "timestamp": "2017-05-04T04:00:00.000Z"
  },
  {
    "bits_per_second": 2559047345,
    "bytes": 1151571305146,
    "timestamp": "2017-05-04T03:00:00.000Z"
  },
  {
    "bits_per_second": 2791166950,
    "bytes": 1256025127397,
    "timestamp": "2017-05-04T02:00:00.000Z"
  },
  {
    "bits_per_second": 3010677565,
    "bytes": 1354804904401,
    "timestamp": "2017-05-04T01:00:00.000Z"
  },
  {
    "bits_per_second": 3220445012,
    "bytes": 1449200255578,
    "timestamp": "2017-05-04T00:00:00.000Z"
  },
  {
    "bits_per_second": 3502427489,
    "bytes": 1576092369853,
    "timestamp": "2017-05-03T23:00:00.000Z"
  },
  {
    "bits_per_second": 3631382819,
    "bytes": 1634122268443,
    "timestamp": "2017-05-03T22:00:00.000Z"
  },
  {
    "bits_per_second": 3712194658,
    "bytes": 1670487596133,
    "timestamp": "2017-05-03T21:00:00.000Z"
  },
  {
    "bits_per_second": 3717926051,
    "bytes": 1673066722886,
    "timestamp": "2017-05-03T20:00:00.000Z"
  },
  {
    "bits_per_second": 3383215275,
    "bytes": 1522446873911,
    "timestamp": "2017-05-03T19:00:00.000Z"
  },
  {
    "bits_per_second": 3282343659,
    "bytes": 1477054646752,
    "timestamp": "2017-05-03T18:00:00.000Z"
  },
  {
    "bits_per_second": 3407860194,
    "bytes": 1533537087513,
    "timestamp": "2017-05-03T17:00:00.000Z"
  },
  {
    "bits_per_second": 3207836021,
    "bytes": 1443526209606,
    "timestamp": "2017-05-03T16:00:00.000Z"
  },
  {
    "bits_per_second": 3033602912,
    "bytes": 1365121310218,
    "timestamp": "2017-05-03T15:00:00.000Z"
  },
  {
    "bits_per_second": 2807214843,
    "bytes": 1263246679437,
    "timestamp": "2017-05-03T14:00:00.000Z"
  },
  {
    "bits_per_second": 2373924868,
    "bytes": 1068266190732,
    "timestamp": "2017-05-03T13:00:00.000Z"
  },
  {
    "bits_per_second": 2183644150,
    "bytes": 982639867437,
    "timestamp": "2017-05-03T12:00:00.000Z"
  },
  {
    "bits_per_second": 2346414301,
    "bytes": 1055886435280,
    "timestamp": "2017-05-03T11:00:00.000Z"
  },
  {
    "bits_per_second": 2208861885,
    "bytes": 993987848135,
    "timestamp": "2017-05-03T10:00:00.000Z"
  },
  {
    "bits_per_second": 1552622503,
    "bytes": 698680126572,
    "timestamp": "2017-05-03T09:00:00.000Z"
  },
  {
    "bits_per_second": 1558926956,
    "bytes": 701517130174,
    "timestamp": "2017-05-03T08:00:00.000Z"
  },
  {
    "bits_per_second": 1893637727,
    "bytes": 852136977012,
    "timestamp": "2017-05-03T07:00:00.000Z"
  },
  {
    "bits_per_second": 2019727461,
    "bytes": 908877357664,
    "timestamp": "2017-05-03T06:00:00.000Z"
  },
  {
    "bits_per_second": 1949804964,
    "bytes": 877412233976,
    "timestamp": "2017-05-03T05:00:00.000Z"
  },
  {
    "bits_per_second": 2164157373,
    "bytes": 973870817970,
    "timestamp": "2017-05-03T04:00:00.000Z"
  },
  {
    "bits_per_second": 2596874354,
    "bytes": 1168593459514,
    "timestamp": "2017-05-03T03:00:00.000Z"
  },
  {
    "bits_per_second": 2818104274,
    "bytes": 1268146923262,
    "timestamp": "2017-05-03T02:00:00.000Z"
  },
  {
    "bits_per_second": 3037615070,
    "bytes": 1366926781318,
    "timestamp": "2017-05-03T01:00:00.000Z"
  },
  {
    "bits_per_second": 3242797408,
    "bytes": 1459258833660,
    "timestamp": "2017-05-03T00:00:00.000Z"
  },
  {
    "bits_per_second": 3498988521,
    "bytes": 1574544834601,
    "timestamp": "2017-05-02T23:00:00.000Z"
  },
  {
    "bits_per_second": 3639979759,
    "bytes": 1637990891457,
    "timestamp": "2017-05-02T22:00:00.000Z"
  },
  {
    "bits_per_second": 3515036445,
    "bytes": 1581766400294,
    "timestamp": "2017-05-02T21:00:00.000Z"
  },
  {
    "bits_per_second": 3554582738,
    "bytes": 1599562232129,
    "timestamp": "2017-05-02T20:00:00.000Z"
  },
  {
    "bits_per_second": 3634248389,
    "bytes": 1635411775254,
    "timestamp": "2017-05-02T19:00:00.000Z"
  },
  {
    "bits_per_second": 3519048260,
    "bytes": 1583571716823,
    "timestamp": "2017-05-02T18:00:00.000Z"
  },
  {
    "bits_per_second": 3188922706,
    "bytes": 1435015217595,
    "timestamp": "2017-05-02T17:00:00.000Z"
  },
  {
    "bits_per_second": 3004373248,
    "bytes": 1351967961543,
    "timestamp": "2017-05-02T16:00:00.000Z"
  },
  {
    "bits_per_second": 2999215064,
    "bytes": 1349646778580,
    "timestamp": "2017-05-02T15:00:00.000Z"
  },
  {
    "bits_per_second": 2792886455,
    "bytes": 1256798904779,
    "timestamp": "2017-05-02T14:00:00.000Z"
  },
  {
    "bits_per_second": 2333805217,
    "bytes": 1050212347650,
    "timestamp": "2017-05-02T13:00:00.000Z"
  },
  {
    "bits_per_second": 2145817128,
    "bytes": 965617707805,
    "timestamp": "2017-05-02T12:00:00.000Z"
  },
  {
    "bits_per_second": 2232933573,
    "bytes": 1004820108042,
    "timestamp": "2017-05-02T11:00:00.000Z"
  },
  {
    "bits_per_second": 2135500797,
    "bytes": 960975358597,
    "timestamp": "2017-05-02T10:00:00.000Z"
  },
  {
    "bits_per_second": 2140658837,
    "bytes": 963296476531,
    "timestamp": "2017-05-02T09:00:00.000Z"
  },
  {
    "bits_per_second": 2131488637,
    "bytes": 959169886427,
    "timestamp": "2017-05-02T08:00:00.000Z"
  },
  {
    "bits_per_second": 1577840497,
    "bytes": 710028223717,
    "timestamp": "2017-05-02T07:00:00.000Z"
  },
  {
    "bits_per_second": 1710807715,
    "bytes": 769863471551,
    "timestamp": "2017-05-02T06:00:00.000Z"
  },
  {
    "bits_per_second": 1913697504,
    "bytes": 861163876937,
    "timestamp": "2017-05-02T05:00:00.000Z"
  },
  {
    "bits_per_second": 2120025906,
    "bytes": 954011657722,
    "timestamp": "2017-05-02T04:00:00.000Z"
  },
  {
    "bits_per_second": 2569936962,
    "bytes": 1156471632771,
    "timestamp": "2017-05-02T03:00:00.000Z"
  },
  {
    "bits_per_second": 2779704322,
    "bytes": 1250866944941,
    "timestamp": "2017-05-02T02:00:00.000Z"
  },
  {
    "bits_per_second": 3023859606,
    "bytes": 1360736822628,
    "timestamp": "2017-05-02T01:00:00.000Z"
  },
  {
    "bits_per_second": 3206689756,
    "bytes": 1443010390002,
    "timestamp": "2017-05-02T00:00:00.000Z"
  },
  {
    "bits_per_second": 3360863043,
    "bytes": 1512388369223,
    "timestamp": "2017-05-01T23:00:00.000Z"
  },
  {
    "bits_per_second": 3485233424,
    "bytes": 1568355040713,
    "timestamp": "2017-05-01T22:00:00.000Z"
  },
  {
    "bits_per_second": 3411872108,
    "bytes": 1535342448416,
    "timestamp": "2017-05-01T21:00:00.000Z"
  },
  {
    "bits_per_second": 3410725868,
    "bytes": 1534826640477,
    "timestamp": "2017-05-01T20:00:00.000Z"
  },
  {
    "bits_per_second": 3469758782,
    "bytes": 1561391451701,
    "timestamp": "2017-05-01T19:00:00.000Z"
  },
  {
    "bits_per_second": 3365448175,
    "bytes": 1514451678549,
    "timestamp": "2017-05-01T18:00:00.000Z"
  },
  {
    "bits_per_second": 3263430120,
    "bytes": 1468543554017,
    "timestamp": "2017-05-01T17:00:00.000Z"
  },
  {
    "bits_per_second": 3044492660,
    "bytes": 1370021697157,
    "timestamp": "2017-05-01T16:00:00.000Z"
  },
  {
    "bits_per_second": 2637566864,
    "bytes": 1186905089002,
    "timestamp": "2017-05-01T15:00:00.000Z"
  },
  {
    "bits_per_second": 2409459233,
    "bytes": 1084256654655,
    "timestamp": "2017-05-01T14:00:00.000Z"
  },
  {
    "bits_per_second": 1948085586,
    "bytes": 876638513791,
    "timestamp": "2017-05-01T13:00:00.000Z"
  },
  {
    "bits_per_second": 1762389830,
    "bytes": 793075423649,
    "timestamp": "2017-05-01T12:00:00.000Z"
  },
  {
    "bits_per_second": 2153267798,
    "bytes": 968970509142,
    "timestamp": "2017-05-01T11:00:00.000Z"
  },
  {
    "bits_per_second": 2008264713,
    "bytes": 903719120648,
    "timestamp": "2017-05-01T10:00:00.000Z"
  },
  {
    "bits_per_second": 1687309042,
    "bytes": 759289068818,
    "timestamp": "2017-05-01T09:00:00.000Z"
  },
  {
    "bits_per_second": 1670115193,
    "bytes": 751551836728,
    "timestamp": "2017-05-01T08:00:00.000Z"
  },
  {
    "bits_per_second": 1471810457,
    "bytes": 662314705484,
    "timestamp": "2017-05-01T07:00:00.000Z"
  },
  {
    "bits_per_second": 1596180665,
    "bytes": 718281299298,
    "timestamp": "2017-05-01T06:00:00.000Z"
  },
  {
    "bits_per_second": 2257005127,
    "bytes": 1015652307040,
    "timestamp": "2017-05-01T05:00:00.000Z"
  },
  {
    "bits_per_second": 2441554600,
    "bytes": 1098699569818,
    "timestamp": "2017-05-01T04:00:00.000Z"
  },
  {
    "bits_per_second": 2433530831,
    "bytes": 1095088873975,
    "timestamp": "2017-05-01T03:00:00.000Z"
  },
  {
    "bits_per_second": 2645017530,
    "bytes": 1190257888510,
    "timestamp": "2017-05-01T02:00:00.000Z"
  },
  {
    "bits_per_second": 2882295585,
    "bytes": 1297033013136,
    "timestamp": "2017-05-01T01:00:00.000Z"
  },
  {
    "bits_per_second": 3085185168,
    "bytes": 1388333325623,
    "timestamp": "2017-05-01T00:00:00.000Z"
  },
  {
    "bits_per_second": 3597567840,
    "bytes": 1618905527978,
    "timestamp": "2017-04-30T23:00:00.000Z"
  },
  {
    "bits_per_second": 3697293412,
    "bytes": 1663782035344,
    "timestamp": "2017-04-30T22:00:00.000Z"
  },
  {
    "bits_per_second": 3515036061,
    "bytes": 1581766227297,
    "timestamp": "2017-04-30T21:00:00.000Z"
  },
  {
    "bits_per_second": 3512170777,
    "bytes": 1580476849641,
    "timestamp": "2017-04-30T20:00:00.000Z"
  },
  {
    "bits_per_second": 3398689957,
    "bytes": 1529410480637,
    "timestamp": "2017-04-30T19:00:00.000Z"
  },
  {
    "bits_per_second": 3284062910,
    "bytes": 1477828309472,
    "timestamp": "2017-04-30T18:00:00.000Z"
  },
  {
    "bits_per_second": 3097220902,
    "bytes": 1393749406083,
    "timestamp": "2017-04-30T17:00:00.000Z"
  },
  {
    "bits_per_second": 2898343428,
    "bytes": 1304254542778,
    "timestamp": "2017-04-30T16:00:00.000Z"
  },
  {
    "bits_per_second": 2603751778,
    "bytes": 1171688300129,
    "timestamp": "2017-04-30T15:00:00.000Z"
  },
  {
    "bits_per_second": 2397423424,
    "bytes": 1078840540778,
    "timestamp": "2017-04-30T14:00:00.000Z"
  },
  {
    "bits_per_second": 2133208170,
    "bytes": 959943676357,
    "timestamp": "2017-04-30T13:00:00.000Z"
  },
  {
    "bits_per_second": 1946366157,
    "bytes": 875864770446,
    "timestamp": "2017-04-30T12:00:00.000Z"
  },
  {
    "bits_per_second": 1769267487,
    "bytes": 796170369302,
    "timestamp": "2017-04-30T11:00:00.000Z"
  },
  {
    "bits_per_second": 1667822629,
    "bytes": 750520182896,
    "timestamp": "2017-04-30T10:00:00.000Z"
  },
  {
    "bits_per_second": 1906819884,
    "bytes": 858068947838,
    "timestamp": "2017-04-30T09:00:00.000Z"
  },
  {
    "bits_per_second": 1924586938,
    "bytes": 866064122211,
    "timestamp": "2017-04-30T08:00:00.000Z"
  },
  {
    "bits_per_second": 1974449895,
    "bytes": 888502452889,
    "timestamp": "2017-04-30T07:00:00.000Z"
  },
  {
    "bits_per_second": 2076467820,
    "bytes": 934410519128,
    "timestamp": "2017-04-30T06:00:00.000Z"
  },
  {
    "bits_per_second": 2011130304,
    "bytes": 905008636953,
    "timestamp": "2017-04-30T05:00:00.000Z"
  },
  {
    "bits_per_second": 2226629046,
    "bytes": 1001983070843,
    "timestamp": "2017-04-30T04:00:00.000Z"
  },
  {
    "bits_per_second": 2666223574,
    "bytes": 1199800608476,
    "timestamp": "2017-04-30T03:00:00.000Z"
  },
  {
    "bits_per_second": 2880002852,
    "bytes": 1296001283479,
    "timestamp": "2017-04-30T02:00:00.000Z"
  },
  {
    "bits_per_second": 3098367315,
    "bytes": 1394265291973,
    "timestamp": "2017-04-30T01:00:00.000Z"
  },
  {
    "bits_per_second": 3307561391,
    "bytes": 1488402625869,
    "timestamp": "2017-04-30T00:00:00.000Z"
  },
  {
    "bits_per_second": 3562606604,
    "bytes": 1603172972014,
    "timestamp": "2017-04-29T23:00:00.000Z"
  },
  {
    "bits_per_second": 3681818636,
    "bytes": 1656818386416,
    "timestamp": "2017-04-29T22:00:00.000Z"
  },
  {
    "bits_per_second": 3878977063,
    "bytes": 1745539678538,
    "timestamp": "2017-04-29T21:00:00.000Z"
  },
  {
    "bits_per_second": 3853185990,
    "bytes": 1733933695299,
    "timestamp": "2017-04-29T20:00:00.000Z"
  },
  {
    "bits_per_second": 3554009463,
    "bytes": 1599304258263,
    "timestamp": "2017-04-29T19:00:00.000Z"
  },
  {
    "bits_per_second": 3466893078,
    "bytes": 1560101884921,
    "timestamp": "2017-04-29T18:00:00.000Z"
  },
  {
    "bits_per_second": 3578654399,
    "bytes": 1610394479632,
    "timestamp": "2017-04-29T17:00:00.000Z"
  },
  {
    "bits_per_second": 3367740701,
    "bytes": 1515483315524,
    "timestamp": "2017-04-29T16:00:00.000Z"
  },
  {
    "bits_per_second": 3165424179,
    "bytes": 1424440880689,
    "timestamp": "2017-04-29T15:00:00.000Z"
  },
  {
    "bits_per_second": 2961387953,
    "bytes": 1332624578877,
    "timestamp": "2017-04-29T14:00:00.000Z"
  },
  {
    "bits_per_second": 2803775828,
    "bytes": 1261699122673,
    "timestamp": "2017-04-29T13:00:00.000Z"
  },
  {
    "bits_per_second": 2592862296,
    "bytes": 1166788033374,
    "timestamp": "2017-04-29T12:00:00.000Z"
  },
  {
    "bits_per_second": 1914843703,
    "bytes": 861679666488,
    "timestamp": "2017-04-29T11:00:00.000Z"
  },
  {
    "bits_per_second": 1791619669,
    "bytes": 806228851150,
    "timestamp": "2017-04-29T10:00:00.000Z"
  },
  {
    "bits_per_second": 2015142258,
    "bytes": 906814015950,
    "timestamp": "2017-04-29T09:00:00.000Z"
  },
  {
    "bits_per_second": 2003679644,
    "bytes": 901655839994,
    "timestamp": "2017-04-29T08:00:00.000Z"
  },
  {
    "bits_per_second": 2078187133,
    "bytes": 935184209787,
    "timestamp": "2017-04-29T07:00:00.000Z"
  },
  {
    "bits_per_second": 2180778325,
    "bytes": 981350246415,
    "timestamp": "2017-04-29T06:00:00.000Z"
  },
  {
    "bits_per_second": 2142951386,
    "bytes": 964328123752,
    "timestamp": "2017-04-29T05:00:00.000Z"
  },
  {
    "bits_per_second": 2368193596,
    "bytes": 1065687118203,
    "timestamp": "2017-04-29T04:00:00.000Z"
  },
  {
    "bits_per_second": 2936170183,
    "bytes": 1321276582139,
    "timestamp": "2017-04-29T03:00:00.000Z"
  },
  {
    "bits_per_second": 3157973355,
    "bytes": 1421088009864,
    "timestamp": "2017-04-29T02:00:00.000Z"
  },
  {
    "bits_per_second": 3216432909,
    "bytes": 1447394809119,
    "timestamp": "2017-04-29T01:00:00.000Z"
  },
  {
    "bits_per_second": 3389519917,
    "bytes": 1525283962783,
    "timestamp": "2017-04-29T00:00:00.000Z"
  },
  {
    "bits_per_second": 3546558818,
    "bytes": 1595951468235,
    "timestamp": "2017-04-28T23:00:00.000Z"
  },
  {
    "bits_per_second": 3653735140,
    "bytes": 1644180813060,
    "timestamp": "2017-04-28T22:00:00.000Z"
  },
  {
    "bits_per_second": 3693854475,
    "bytes": 1662234513821,
    "timestamp": "2017-04-28T21:00:00.000Z"
  },
  {
    "bits_per_second": 3699585860,
    "bytes": 1664813637143,
    "timestamp": "2017-04-28T20:00:00.000Z"
  },
  {
    "bits_per_second": 3889866627,
    "bytes": 1750439982238,
    "timestamp": "2017-04-28T19:00:00.000Z"
  },
  {
    "bits_per_second": 3761484392,
    "bytes": 1692667976449,
    "timestamp": "2017-04-28T18:00:00.000Z"
  },
  {
    "bits_per_second": 3458296177,
    "bytes": 1556233279539,
    "timestamp": "2017-04-28T17:00:00.000Z"
  },
  {
    "bits_per_second": 3263430175,
    "bytes": 1468543578764,
    "timestamp": "2017-04-28T16:00:00.000Z"
  },
  {
    "bits_per_second": 3018128432,
    "bytes": 1358157794322,
    "timestamp": "2017-04-28T15:00:00.000Z"
  },
  {
    "bits_per_second": 2828420656,
    "bytes": 1272789295152,
    "timestamp": "2017-04-28T14:00:00.000Z"
  },
  {
    "bits_per_second": 2601459371,
    "bytes": 1170656717067,
    "timestamp": "2017-04-28T13:00:00.000Z"
  },
  {
    "bits_per_second": 2414044115,
    "bytes": 1086319851654,
    "timestamp": "2017-04-28T12:00:00.000Z"
  },
  {
    "bits_per_second": 2468492056,
    "bytes": 1110821425022,
    "timestamp": "2017-04-28T11:00:00.000Z"
  },
  {
    "bits_per_second": 2349853245,
    "bytes": 1057433960446,
    "timestamp": "2017-04-28T10:00:00.000Z"
  },
  {
    "bits_per_second": 2308587390,
    "bytes": 1038864325623,
    "timestamp": "2017-04-28T09:00:00.000Z"
  },
  {
    "bits_per_second": 2308014286,
    "bytes": 1038606428786,
    "timestamp": "2017-04-28T08:00:00.000Z"
  },
  {
    "bits_per_second": 2363035309,
    "bytes": 1063365888868,
    "timestamp": "2017-04-28T07:00:00.000Z"
  },
  {
    "bits_per_second": 2479381789,
    "bytes": 1115721804872,
    "timestamp": "2017-04-28T06:00:00.000Z"
  },
  {
    "bits_per_second": 2400289004,
    "bytes": 1080130051663,
    "timestamp": "2017-04-28T05:00:00.000Z"
  },
  {
    "bits_per_second": 2631262416,
    "bytes": 1184068087399,
    "timestamp": "2017-04-28T04:00:00.000Z"
  },
  {
    "bits_per_second": 2685137000,
    "bytes": 1208311649970,
    "timestamp": "2017-04-28T03:00:00.000Z"
  },
  {
    "bits_per_second": 2873125271,
    "bytes": 1292906371730,
    "timestamp": "2017-04-28T02:00:00.000Z"
  },
  {
    "bits_per_second": 3262857046,
    "bytes": 1468285670593,
    "timestamp": "2017-04-28T01:00:00.000Z"
  },
  {
    "bits_per_second": 3473197502,
    "bytes": 1562938875836,
    "timestamp": "2017-04-28T00:00:00.000Z"
  },
  {
    "bits_per_second": 3861782878,
    "bytes": 1737802294893,
    "timestamp": "2017-04-27T23:00:00.000Z"
  },
  {
    "bits_per_second": 3978702446,
    "bytes": 1790416100573,
    "timestamp": "2017-04-27T22:00:00.000Z"
  },
  {
    "bits_per_second": 3835418807,
    "bytes": 1725938463082,
    "timestamp": "2017-04-27T21:00:00.000Z"
  },
  {
    "bits_per_second": 3842296439,
    "bytes": 1729033397371,
    "timestamp": "2017-04-27T20:00:00.000Z"
  },
  {
    "bits_per_second": 3735693293,
    "bytes": 1681061981777,
    "timestamp": "2017-04-27T19:00:00.000Z"
  },
  {
    "bits_per_second": 3621639565,
    "bytes": 1629737804169,
    "timestamp": "2017-04-27T18:00:00.000Z"
  },
  {
    "bits_per_second": 3460588636,
    "bytes": 1557264886375,
    "timestamp": "2017-04-27T17:00:00.000Z"
  },
  {
    "bits_per_second": 3260564720,
    "bytes": 1467254123911,
    "timestamp": "2017-04-27T16:00:00.000Z"
  },
  {
    "bits_per_second": 3317304779,
    "bytes": 1492787150641,
    "timestamp": "2017-04-27T15:00:00.000Z"
  },
  {
    "bits_per_second": 3129889812,
    "bytes": 1408450415376,
    "timestamp": "2017-04-27T14:00:00.000Z"
  },
  {
    "bits_per_second": 3001507421,
    "bytes": 1350678339547,
    "timestamp": "2017-04-27T13:00:00.000Z"
  },
  {
    "bits_per_second": 2791740040,
    "bytes": 1256283018200,
    "timestamp": "2017-04-27T12:00:00.000Z"
  },
  {
    "bits_per_second": 2144670853,
    "bytes": 965101883900,
    "timestamp": "2017-04-27T11:00:00.000Z"
  },
  {
    "bits_per_second": 2032336233,
    "bytes": 914551304933,
    "timestamp": "2017-04-27T10:00:00.000Z"
  },
  {
    "bits_per_second": 2492563764,
    "bytes": 1121653693841,
    "timestamp": "2017-04-27T09:00:00.000Z"
  },
  {
    "bits_per_second": 2460468111,
    "bytes": 1107210650054,
    "timestamp": "2017-04-27T08:00:00.000Z"
  },
  {
    "bits_per_second": 2035201894,
    "bytes": 915840852232,
    "timestamp": "2017-04-27T07:00:00.000Z"
  },
  {
    "bits_per_second": 2160718653,
    "bytes": 972323393751,
    "timestamp": "2017-04-27T06:00:00.000Z"
  },
  {
    "bits_per_second": 2544145882,
    "bytes": 1144865646915,
    "timestamp": "2017-04-27T05:00:00.000Z"
  },
  {
    "bits_per_second": 2726975787,
    "bytes": 1227139104105,
    "timestamp": "2017-04-27T04:00:00.000Z"
  },
  {
    "bits_per_second": 2803775945,
    "bytes": 1261699175278,
    "timestamp": "2017-04-27T03:00:00.000Z"
  },
  {
    "bits_per_second": 3024432909,
    "bytes": 1360994809194,
    "timestamp": "2017-04-27T02:00:00.000Z"
  },
  {
    "bits_per_second": 3396397566,
    "bytes": 1528378904696,
    "timestamp": "2017-04-27T01:00:00.000Z"
  },
  {
    "bits_per_second": 3610176755,
    "bytes": 1624579539927,
    "timestamp": "2017-04-27T00:00:00.000Z"
  },
  {
    "bits_per_second": 3737412753,
    "bytes": 1681835739038,
    "timestamp": "2017-04-26T23:00:00.000Z"
  },
  {
    "bits_per_second": 3849747226,
    "bytes": 1732386251693,
    "timestamp": "2017-04-26T22:00:00.000Z"
  },
  {
    "bits_per_second": 3846881501,
    "bytes": 1731096675506,
    "timestamp": "2017-04-26T21:00:00.000Z"
  },
  {
    "bits_per_second": 3834845612,
    "bytes": 1725680525183,
    "timestamp": "2017-04-26T20:00:00.000Z"
  },
  {
    "bits_per_second": 3964374006,
    "bytes": 1783968302665,
    "timestamp": "2017-04-26T19:00:00.000Z"
  },
  {
    "bits_per_second": 3846881674,
    "bytes": 1731096753281,
    "timestamp": "2017-04-26T18:00:00.000Z"
  },
  {
    "bits_per_second": 3429639257,
    "bytes": 1543337665484,
    "timestamp": "2017-04-26T17:00:00.000Z"
  },
  {
    "bits_per_second": 3226749519,
    "bytes": 1452037283387,
    "timestamp": "2017-04-26T16:00:00.000Z"
  },
  {
    "bits_per_second": 3381495889,
    "bytes": 1521673149982,
    "timestamp": "2017-04-26T15:00:00.000Z"
  },
  {
    "bits_per_second": 3159119582,
    "bytes": 1421603811729,
    "timestamp": "2017-04-26T14:00:00.000Z"
  },
  {
    "bits_per_second": 2463906916,
    "bytes": 1108758112081,
    "timestamp": "2017-04-26T13:00:00.000Z"
  },
  {
    "bits_per_second": 2275918659,
    "bytes": 1024163396755,
    "timestamp": "2017-04-26T12:00:00.000Z"
  },
  {
    "bits_per_second": 2329793384,
    "bytes": 1048407022715,
    "timestamp": "2017-04-26T11:00:00.000Z"
  },
  {
    "bits_per_second": 2226056035,
    "bytes": 1001725215784,
    "timestamp": "2017-04-26T10:00:00.000Z"
  },
  {
    "bits_per_second": 1919428819,
    "bytes": 863742968381,
    "timestamp": "2017-04-26T09:00:00.000Z"
  },
  {
    "bits_per_second": 1910258636,
    "bytes": 859616386092,
    "timestamp": "2017-04-26T08:00:00.000Z"
  },
  {
    "bits_per_second": 2228348440,
    "bytes": 1002756797822,
    "timestamp": "2017-04-26T07:00:00.000Z"
  },
  {
    "bits_per_second": 2361889065,
    "bytes": 1062850079359,
    "timestamp": "2017-04-26T06:00:00.000Z"
  },
  {
    "bits_per_second": 2709781779,
    "bytes": 1219401800616,
    "timestamp": "2017-04-26T05:00:00.000Z"
  },
  {
    "bits_per_second": 2910952201,
    "bytes": 1309928490408,
    "timestamp": "2017-04-26T04:00:00.000Z"
  },
  {
    "bits_per_second": 2777984963,
    "bytes": 1250093233518,
    "timestamp": "2017-04-26T03:00:00.000Z"
  },
  {
    "bits_per_second": 2982593953,
    "bytes": 1342167278889,
    "timestamp": "2017-04-26T02:00:00.000Z"
  },
  {
    "bits_per_second": 3360863143,
    "bytes": 1512388414260,
    "timestamp": "2017-04-26T01:00:00.000Z"
  },
  {
    "bits_per_second": 3567191520,
    "bytes": 1605236184008,
    "timestamp": "2017-04-26T00:00:00.000Z"
  },
  {
    "bits_per_second": 3758045486,
    "bytes": 1691120468759,
    "timestamp": "2017-04-25T23:00:00.000Z"
  },
  {
    "bits_per_second": 3896744332,
    "bytes": 1753534949486,
    "timestamp": "2017-04-25T22:00:00.000Z"
  },
  {
    "bits_per_second": 3912791837,
    "bytes": 1760756326633,
    "timestamp": "2017-04-25T21:00:00.000Z"
  },
  {
    "bits_per_second": 3919096382,
    "bytes": 1763593371884,
    "timestamp": "2017-04-25T20:00:00.000Z"
  },
  {
    "bits_per_second": 3653735120,
    "bytes": 1644180803892,
    "timestamp": "2017-04-25T19:00:00.000Z"
  },
  {
    "bits_per_second": 3523060216,
    "bytes": 1585377097163,
    "timestamp": "2017-04-25T18:00:00.000Z"
  },
  {
    "bits_per_second": 3310427145,
    "bytes": 1489692215200,
    "timestamp": "2017-04-25T17:00:00.000Z"
  },
  {
    "bits_per_second": 3096647835,
    "bytes": 1393491525926,
    "timestamp": "2017-04-25T16:00:00.000Z"
  },
  {
    "bits_per_second": 2843895344,
    "bytes": 1279752904592,
    "timestamp": "2017-04-25T15:00:00.000Z"
  },
  {
    "bits_per_second": 2622665333,
    "bytes": 1180199399683,
    "timestamp": "2017-04-25T14:00:00.000Z"
  },
  {
    "bits_per_second": 2438689022,
    "bytes": 1097410059681,
    "timestamp": "2017-04-25T13:00:00.000Z"
  },
  {
    "bits_per_second": 2252993285,
    "bytes": 1013846978426,
    "timestamp": "2017-04-25T12:00:00.000Z"
  },
  {
    "bits_per_second": 2570510038,
    "bytes": 1156729516884,
    "timestamp": "2017-04-25T11:00:00.000Z"
  },
  {
    "bits_per_second": 2442127799,
    "bytes": 1098957509511,
    "timestamp": "2017-04-25T10:00:00.000Z"
  },
  {
    "bits_per_second": 1853518282,
    "bytes": 834083226866,
    "timestamp": "2017-04-25T09:00:00.000Z"
  },
  {
    "bits_per_second": 1855810765,
    "bytes": 835114844291,
    "timestamp": "2017-04-25T08:00:00.000Z"
  },
  {
    "bits_per_second": 2163584288,
    "bytes": 973612929381,
    "timestamp": "2017-04-25T07:00:00.000Z"
  },
  {
    "bits_per_second": 2285662006,
    "bytes": 1028547902627,
    "timestamp": "2017-04-25T06:00:00.000Z"
  },
  {
    "bits_per_second": 2661065314,
    "bytes": 1197479391413,
    "timestamp": "2017-04-25T05:00:00.000Z"
  },
  {
    "bits_per_second": 2884014732,
    "bytes": 1297806629231,
    "timestamp": "2017-04-25T04:00:00.000Z"
  },
  {
    "bits_per_second": 2695453505,
    "bytes": 1212954077423,
    "timestamp": "2017-04-25T03:00:00.000Z"
  },
  {
    "bits_per_second": 2923561302,
    "bytes": 1315602585709,
    "timestamp": "2017-04-25T02:00:00.000Z"
  },
  {
    "bits_per_second": 3303549654,
    "bytes": 1486597344280,
    "timestamp": "2017-04-25T01:00:00.000Z"
  },
  {
    "bits_per_second": 3490964671,
    "bytes": 1570934102164,
    "timestamp": "2017-04-25T00:00:00.000Z"
  },
  {
    "bits_per_second": 3192792525,
    "bytes": 1436756636314,
    "timestamp": "2017-04-24T23:00:00.000Z"
  },
  {
    "bits_per_second": 3283904240,
    "bytes": 1477756907869,
    "timestamp": "2017-04-24T22:00:00.000Z"
  },
  {
    "bits_per_second": 3142792255,
    "bytes": 1414256514718,
    "timestamp": "2017-04-24T21:00:00.000Z"
  },
  {
    "bits_per_second": 3147792175,
    "bytes": 1416506478670,
    "timestamp": "2017-04-24T20:00:00.000Z"
  },
  {
    "bits_per_second": 3286681885,
    "bytes": 1479006848174,
    "timestamp": "2017-04-24T19:00:00.000Z"
  },
  {
    "bits_per_second": 3167792288,
    "bytes": 1425506529660,
    "timestamp": "2017-04-24T18:00:00.000Z"
  },
  {
    "bits_per_second": 2930013465,
    "bytes": 1318506059432,
    "timestamp": "2017-04-24T17:00:00.000Z"
  },
  {
    "bits_per_second": 2738901616,
    "bytes": 1232505727170,
    "timestamp": "2017-04-24T16:00:00.000Z"
  },
  {
    "bits_per_second": 2407788873,
    "bytes": 1083504992835,
    "timestamp": "2017-04-24T15:00:00.000Z"
  },
  {
    "bits_per_second": 2210565758,
    "bytes": 994754591045,
    "timestamp": "2017-04-24T14:00:00.000Z"
  },
  {
    "bits_per_second": 2408344461,
    "bytes": 1083755007453,
    "timestamp": "2017-04-24T13:00:00.000Z"
  },
  {
    "bits_per_second": 2226121328,
    "bytes": 1001754597681,
    "timestamp": "2017-04-24T12:00:00.000Z"
  },
  {
    "bits_per_second": 1881119899,
    "bytes": 846503954412,
    "timestamp": "2017-04-24T11:00:00.000Z"
  },
  {
    "bits_per_second": 1775008218,
    "bytes": 798753698130,
    "timestamp": "2017-04-24T10:00:00.000Z"
  },
  {
    "bits_per_second": 1722785769,
    "bytes": 775253596166,
    "timestamp": "2017-04-24T09:00:00.000Z"
  },
  {
    "bits_per_second": 1709452255,
    "bytes": 769253514888,
    "timestamp": "2017-04-24T08:00:00.000Z"
  },
  {
    "bits_per_second": 1549451578,
    "bytes": 697253210095,
    "timestamp": "2017-04-24T07:00:00.000Z"
  },
  {
    "bits_per_second": 1641118727,
    "bytes": 738503427054,
    "timestamp": "2017-04-24T06:00:00.000Z"
  },
  {
    "bits_per_second": 1858341991,
    "bytes": 836253896035,
    "timestamp": "2017-04-24T05:00:00.000Z"
  },
  {
    "bits_per_second": 2048342757,
    "bytes": 921754240534,
    "timestamp": "2017-04-24T04:00:00.000Z"
  },
  {
    "bits_per_second": 2510567108,
    "bytes": 1129755198442,
    "timestamp": "2017-04-24T03:00:00.000Z"
  },
  {
    "bits_per_second": 2727790264,
    "bytes": 1227505618994,
    "timestamp": "2017-04-24T02:00:00.000Z"
  },
  {
    "bits_per_second": 2759457067,
    "bytes": 1241755680118,
    "timestamp": "2017-04-24T01:00:00.000Z"
  },
  {
    "bits_per_second": 2947791407,
    "bytes": 1326506133060,
    "timestamp": "2017-04-24T00:00:00.000Z"
  },
  {
    "bits_per_second": 2877235557,
    "bytes": 1294756000473,
    "timestamp": "2017-04-23T23:00:00.000Z"
  },
  {
    "bits_per_second": 2972235841,
    "bytes": 1337506128411,
    "timestamp": "2017-04-23T22:00:00.000Z"
  },
  {
    "bits_per_second": 3113903235,
    "bytes": 1401256455764,
    "timestamp": "2017-04-23T21:00:00.000Z"
  },
  {
    "bits_per_second": 3116680997,
    "bytes": 1402506448747,
    "timestamp": "2017-04-23T20:00:00.000Z"
  },
  {
    "bits_per_second": 3119458763,
    "bytes": 1403756443318,
    "timestamp": "2017-04-23T19:00:00.000Z"
  },
  {
    "bits_per_second": 2998902600,
    "bytes": 1349506169940,
    "timestamp": "2017-04-23T18:00:00.000Z"
  },
  {
    "bits_per_second": 2566123005,
    "bytes": 1154755352048,
    "timestamp": "2017-04-23T17:00:00.000Z"
  },
  {
    "bits_per_second": 2413344464,
    "bytes": 1086005008673,
    "timestamp": "2017-04-23T16:00:00.000Z"
  },
  {
    "bits_per_second": 2210010181,
    "bytes": 994504581311,
    "timestamp": "2017-04-23T15:00:00.000Z"
  },
  {
    "bits_per_second": 2035564887,
    "bytes": 916004199136,
    "timestamp": "2017-04-23T14:00:00.000Z"
  },
  {
    "bits_per_second": 2244454867,
    "bytes": 1010004690201,
    "timestamp": "2017-04-23T13:00:00.000Z"
  },
  {
    "bits_per_second": 2048342834,
    "bytes": 921754275237,
    "timestamp": "2017-04-23T12:00:00.000Z"
  },
  {
    "bits_per_second": 1443895557,
    "bytes": 649753000871,
    "timestamp": "2017-04-23T11:00:00.000Z"
  },
  {
    "bits_per_second": 1359450826,
    "bytes": 611752871737,
    "timestamp": "2017-04-23T10:00:00.000Z"
  },
  {
    "bits_per_second": 1825563990,
    "bytes": 821503795635,
    "timestamp": "2017-04-23T09:00:00.000Z"
  },
  {
    "bits_per_second": 1822230638,
    "bytes": 820003787211,
    "timestamp": "2017-04-23T08:00:00.000Z"
  },
  {
    "bits_per_second": 1311672686,
    "bytes": 590252708524,
    "timestamp": "2017-04-23T07:00:00.000Z"
  },
  {
    "bits_per_second": 1432784295,
    "bytes": 644752932881,
    "timestamp": "2017-04-23T06:00:00.000Z"
  },
  {
    "bits_per_second": 1627229664,
    "bytes": 732253348808,
    "timestamp": "2017-04-23T05:00:00.000Z"
  },
  {
    "bits_per_second": 1783341559,
    "bytes": 802503701758,
    "timestamp": "2017-04-23T04:00:00.000Z"
  },
  {
    "bits_per_second": 2366122037,
    "bytes": 1064754916750,
    "timestamp": "2017-04-23T03:00:00.000Z"
  },
  {
    "bits_per_second": 2553900650,
    "bytes": 1149255292545,
    "timestamp": "2017-04-23T02:00:00.000Z"
  },
  {
    "bits_per_second": 2557233996,
    "bytes": 1150755298079,
    "timestamp": "2017-04-23T01:00:00.000Z"
  },
  {
    "bits_per_second": 2739457023,
    "bytes": 1232755660403,
    "timestamp": "2017-04-23T00:00:00.000Z"
  },
  {
    "bits_per_second": 3032791697,
    "bytes": 1364756263564,
    "timestamp": "2017-04-22T23:00:00.000Z"
  },
  {
    "bits_per_second": 3104458806,
    "bytes": 1397006462509,
    "timestamp": "2017-04-22T22:00:00.000Z"
  },
  {
    "bits_per_second": 3070569780,
    "bytes": 1381756400953,
    "timestamp": "2017-04-22T21:00:00.000Z"
  },
  {
    "bits_per_second": 3079458569,
    "bytes": 1385756355919,
    "timestamp": "2017-04-22T20:00:00.000Z"
  },
  {
    "bits_per_second": 2882235538,
    "bytes": 1297005992167,
    "timestamp": "2017-04-22T19:00:00.000Z"
  },
  {
    "bits_per_second": 2781124024,
    "bytes": 1251505810713,
    "timestamp": "2017-04-22T18:00:00.000Z"
  },
  {
    "bits_per_second": 2944458087,
    "bytes": 1325006139198,
    "timestamp": "2017-04-22T17:00:00.000Z"
  },
  {
    "bits_per_second": 2751679351,
    "bytes": 1238255707979,
    "timestamp": "2017-04-22T16:00:00.000Z"
  },
  {
    "bits_per_second": 2385011075,
    "bytes": 1073254983712,
    "timestamp": "2017-04-22T15:00:00.000Z"
  },
  {
    "bits_per_second": 2196121266,
    "bytes": 988254569735,
    "timestamp": "2017-04-22T14:00:00.000Z"
  },
  {
    "bits_per_second": 1765008199,
    "bytes": 794253689652,
    "timestamp": "2017-04-22T13:00:00.000Z"
  },
  {
    "bits_per_second": 1602229647,
    "bytes": 721003341227,
    "timestamp": "2017-04-22T12:00:00.000Z"
  },
  {
    "bits_per_second": 1708341082,
    "bytes": 768753486973,
    "timestamp": "2017-04-22T11:00:00.000Z"
  },
  {
    "bits_per_second": 1607229609,
    "bytes": 723253324113,
    "timestamp": "2017-04-22T10:00:00.000Z"
  },
  {
    "bits_per_second": 1277783725,
    "bytes": 575002676062,
    "timestamp": "2017-04-22T09:00:00.000Z"
  },
  {
    "bits_per_second": 1293339257,
    "bytes": 582002665568,
    "timestamp": "2017-04-22T08:00:00.000Z"
  },
  {
    "bits_per_second": 1346117314,
    "bytes": 605752791186,
    "timestamp": "2017-04-22T07:00:00.000Z"
  },
  {
    "bits_per_second": 1473340069,
    "bytes": 663003030829,
    "timestamp": "2017-04-22T06:00:00.000Z"
  },
  {
    "bits_per_second": 1645007631,
    "bytes": 740253433885,
    "timestamp": "2017-04-22T05:00:00.000Z"
  },
  {
    "bits_per_second": 1838897317,
    "bytes": 827503792798,
    "timestamp": "2017-04-22T04:00:00.000Z"
  },
  {
    "bits_per_second": 2227232568,
    "bytes": 1002254655668,
    "timestamp": "2017-04-22T03:00:00.000Z"
  },
  {
    "bits_per_second": 2398900045,
    "bytes": 1079505020212,
    "timestamp": "2017-04-22T02:00:00.000Z"
  },
  {
    "bits_per_second": 2601678696,
    "bytes": 1170755413309,
    "timestamp": "2017-04-22T01:00:00.000Z"
  },
  {
    "bits_per_second": 2772234986,
    "bytes": 1247505743645,
    "timestamp": "2017-04-22T00:00:00.000Z"
  }
])

export const starburstSecondaryData = Immutable.fromJS([
  {
    "bits_per_second": 2915569023,
    "bytes": 1312006060519,
    "timestamp": "2017-04-21T23:00:00.000Z"
  },
  {
    "bits_per_second": 2981124931,
    "bytes": 1341506218733,
    "timestamp": "2017-04-21T22:00:00.000Z"
  },
  {
    "bits_per_second": 3078902981,
    "bytes": 1385506341508,
    "timestamp": "2017-04-21T21:00:00.000Z"
  },
  {
    "bits_per_second": 3117236633,
    "bytes": 1402756484686,
    "timestamp": "2017-04-21T20:00:00.000Z"
  },
  {
    "bits_per_second": 3268903954,
    "bytes": 1471006779262,
    "timestamp": "2017-04-21T19:00:00.000Z"
  },
  {
    "bits_per_second": 3165570227,
    "bytes": 1424506602073,
    "timestamp": "2017-04-21T18:00:00.000Z"
  },
  {
    "bits_per_second": 2681123548,
    "bytes": 1206505596533,
    "timestamp": "2017-04-21T17:00:00.000Z"
  },
  {
    "bits_per_second": 2535567287,
    "bytes": 1141005279179,
    "timestamp": "2017-04-21T16:00:00.000Z"
  },
  {
    "bits_per_second": 2308344001,
    "bytes": 1038754800654,
    "timestamp": "2017-04-21T15:00:00.000Z"
  },
  {
    "bits_per_second": 2143343291,
    "bytes": 964504480982,
    "timestamp": "2017-04-21T14:00:00.000Z"
  },
  {
    "bits_per_second": 1925008848,
    "bytes": 866253981520,
    "timestamp": "2017-04-21T13:00:00.000Z"
  },
  {
    "bits_per_second": 1726674644,
    "bytes": 777003589621,
    "timestamp": "2017-04-21T12:00:00.000Z"
  },
  {
    "bits_per_second": 1811119403,
    "bytes": 815003731557,
    "timestamp": "2017-04-21T11:00:00.000Z"
  },
  {
    "bits_per_second": 1702230089,
    "bytes": 766003539834,
    "timestamp": "2017-04-21T10:00:00.000Z"
  },
  {
    "bits_per_second": 1918897744,
    "bytes": 863503984600,
    "timestamp": "2017-04-21T09:00:00.000Z"
  },
  {
    "bits_per_second": 1931675678,
    "bytes": 869254054949,
    "timestamp": "2017-04-21T08:00:00.000Z"
  },
  {
    "bits_per_second": 1491673556,
    "bytes": 671253099999,
    "timestamp": "2017-04-21T07:00:00.000Z"
  },
  {
    "bits_per_second": 1577784972,
    "bytes": 710003237195,
    "timestamp": "2017-04-21T06:00:00.000Z"
  },
  {
    "bits_per_second": 1765563581,
    "bytes": 794503611552,
    "timestamp": "2017-04-21T05:00:00.000Z"
  },
  {
    "bits_per_second": 1963342403,
    "bytes": 883504081368,
    "timestamp": "2017-04-21T04:00:00.000Z"
  },
  {
    "bits_per_second": 2185565600,
    "bytes": 983504520136,
    "timestamp": "2017-04-21T03:00:00.000Z"
  },
  {
    "bits_per_second": 2375566520,
    "bytes": 1069004933821,
    "timestamp": "2017-04-21T02:00:00.000Z"
  },
  {
    "bits_per_second": 2716123477,
    "bytes": 1222255564693,
    "timestamp": "2017-04-21T01:00:00.000Z"
  },
  {
    "bits_per_second": 2884457598,
    "bytes": 1298005919295,
    "timestamp": "2017-04-21T00:00:00.000Z"
  },
  {
    "bits_per_second": 3170570205,
    "bytes": 1426756592068,
    "timestamp": "2017-04-20T23:00:00.000Z"
  },
  {
    "bits_per_second": 3272792639,
    "bytes": 1472756687531,
    "timestamp": "2017-04-20T22:00:00.000Z"
  },
  {
    "bits_per_second": 3075014106,
    "bytes": 1383756347834,
    "timestamp": "2017-04-20T21:00:00.000Z"
  },
  {
    "bits_per_second": 3071125181,
    "bytes": 1382006331355,
    "timestamp": "2017-04-20T20:00:00.000Z"
  },
  {
    "bits_per_second": 3032236337,
    "bytes": 1364506351805,
    "timestamp": "2017-04-20T19:00:00.000Z"
  },
  {
    "bits_per_second": 2927235732,
    "bytes": 1317256079491,
    "timestamp": "2017-04-20T18:00:00.000Z"
  },
  {
    "bits_per_second": 2905568926,
    "bytes": 1307506016514,
    "timestamp": "2017-04-20T17:00:00.000Z"
  },
  {
    "bits_per_second": 2725568092,
    "bytes": 1226505641423,
    "timestamp": "2017-04-20T16:00:00.000Z"
  },
  {
    "bits_per_second": 2367788717,
    "bytes": 1065504922654,
    "timestamp": "2017-04-20T15:00:00.000Z"
  },
  {
    "bits_per_second": 2195010173,
    "bytes": 987754577998,
    "timestamp": "2017-04-20T14:00:00.000Z"
  },
  {
    "bits_per_second": 2353899725,
    "bytes": 1059254876057,
    "timestamp": "2017-04-20T13:00:00.000Z"
  },
  {
    "bits_per_second": 2171676724,
    "bytes": 977254525895,
    "timestamp": "2017-04-20T12:00:00.000Z"
  },
  {
    "bits_per_second": 2098898498,
    "bytes": 944504324093,
    "timestamp": "2017-04-20T11:00:00.000Z"
  },
  {
    "bits_per_second": 1975564759,
    "bytes": 889004141597,
    "timestamp": "2017-04-20T10:00:00.000Z"
  },
  {
    "bits_per_second": 1968342449,
    "bytes": 885754102218,
    "timestamp": "2017-04-20T09:00:00.000Z"
  },
  {
    "bits_per_second": 1962231230,
    "bytes": 883004053332,
    "timestamp": "2017-04-20T08:00:00.000Z"
  },
  {
    "bits_per_second": 1529451529,
    "bytes": 688253188244,
    "timestamp": "2017-04-20T07:00:00.000Z"
  },
  {
    "bits_per_second": 1612785206,
    "bytes": 725753342882,
    "timestamp": "2017-04-20T06:00:00.000Z"
  },
  {
    "bits_per_second": 1777785944,
    "bytes": 800003674937,
    "timestamp": "2017-04-20T05:00:00.000Z"
  },
  {
    "bits_per_second": 1980009113,
    "bytes": 891004101041,
    "timestamp": "2017-04-20T04:00:00.000Z"
  },
  {
    "bits_per_second": 2207788077,
    "bytes": 993504634827,
    "timestamp": "2017-04-20T03:00:00.000Z"
  },
  {
    "bits_per_second": 2403899944,
    "bytes": 1081754974682,
    "timestamp": "2017-04-20T02:00:00.000Z"
  },
  {
    "bits_per_second": 2746123826,
    "bytes": 1235755721547,
    "timestamp": "2017-04-20T01:00:00.000Z"
  },
  {
    "bits_per_second": 2950569215,
    "bytes": 1327756146650,
    "timestamp": "2017-04-20T00:00:00.000Z"
  },
  {
    "bits_per_second": 2982791525,
    "bytes": 1342256186132,
    "timestamp": "2017-04-19T23:00:00.000Z"
  },
  {
    "bits_per_second": 3077236474,
    "bytes": 1384756413342,
    "timestamp": "2017-04-19T22:00:00.000Z"
  },
  {
    "bits_per_second": 3197792526,
    "bytes": 1439006636696,
    "timestamp": "2017-04-19T21:00:00.000Z"
  },
  {
    "bits_per_second": 3224459301,
    "bytes": 1451006685271,
    "timestamp": "2017-04-19T20:00:00.000Z"
  },
  {
    "bits_per_second": 3053347433,
    "bytes": 1374006345032,
    "timestamp": "2017-04-19T19:00:00.000Z"
  },
  {
    "bits_per_second": 2941124633,
    "bytes": 1323506084927,
    "timestamp": "2017-04-19T18:00:00.000Z"
  },
  {
    "bits_per_second": 3086125463,
    "bytes": 1388756458237,
    "timestamp": "2017-04-19T17:00:00.000Z"
  },
  {
    "bits_per_second": 2878346816,
    "bytes": 1295256067387,
    "timestamp": "2017-04-19T16:00:00.000Z"
  },
  {
    "bits_per_second": 2357788737,
    "bytes": 1061004931536,
    "timestamp": "2017-04-19T15:00:00.000Z"
  },
  {
    "bits_per_second": 2153898669,
    "bytes": 969254400949,
    "timestamp": "2017-04-19T14:00:00.000Z"
  },
  {
    "bits_per_second": 1932231123,
    "bytes": 869504005358,
    "timestamp": "2017-04-19T13:00:00.000Z"
  },
  {
    "bits_per_second": 1783341652,
    "bytes": 802503743255,
    "timestamp": "2017-04-19T12:00:00.000Z"
  },
  {
    "bits_per_second": 1832230738,
    "bytes": 824503832139,
    "timestamp": "2017-04-19T11:00:00.000Z"
  },
  {
    "bits_per_second": 1740007997,
    "bytes": 783003598625,
    "timestamp": "2017-04-19T10:00:00.000Z"
  },
  {
    "bits_per_second": 1482784535,
    "bytes": 667253040713,
    "timestamp": "2017-04-19T09:00:00.000Z"
  },
  {
    "bits_per_second": 1486117976,
    "bytes": 668753089121,
    "timestamp": "2017-04-19T08:00:00.000Z"
  },
  {
    "bits_per_second": 1748896930,
    "bytes": 787003618410,
    "timestamp": "2017-04-19T07:00:00.000Z"
  },
  {
    "bits_per_second": 1847230665,
    "bytes": 831253799253,
    "timestamp": "2017-04-19T06:00:00.000Z"
  },
  {
    "bits_per_second": 1783341656,
    "bytes": 802503745386,
    "timestamp": "2017-04-19T05:00:00.000Z"
  },
  {
    "bits_per_second": 1980564694,
    "bytes": 891254112274,
    "timestamp": "2017-04-19T04:00:00.000Z"
  },
  {
    "bits_per_second": 2350010732,
    "bytes": 1057504829270,
    "timestamp": "2017-04-19T03:00:00.000Z"
  },
  {
    "bits_per_second": 2546122875,
    "bytes": 1145755293756,
    "timestamp": "2017-04-19T02:00:00.000Z"
  },
  {
    "bits_per_second": 2742790437,
    "bytes": 1234255696868,
    "timestamp": "2017-04-19T01:00:00.000Z"
  },
  {
    "bits_per_second": 2915013408,
    "bytes": 1311756033809,
    "timestamp": "2017-04-19T00:00:00.000Z"
  },
  {
    "bits_per_second": 3049458456,
    "bytes": 1372256305003,
    "timestamp": "2017-04-18T23:00:00.000Z"
  },
  {
    "bits_per_second": 3170570252,
    "bytes": 1426756613374,
    "timestamp": "2017-04-18T22:00:00.000Z"
  },
  {
    "bits_per_second": 3181681177,
    "bytes": 1431756529626,
    "timestamp": "2017-04-18T21:00:00.000Z"
  },
  {
    "bits_per_second": 3209459142,
    "bytes": 1444256613838,
    "timestamp": "2017-04-18T20:00:00.000Z"
  },
  {
    "bits_per_second": 3128347693,
    "bytes": 1407756461677,
    "timestamp": "2017-04-18T19:00:00.000Z"
  },
  {
    "bits_per_second": 3032791753,
    "bytes": 1364756289059,
    "timestamp": "2017-04-18T18:00:00.000Z"
  },
  {
    "bits_per_second": 3088347532,
    "bytes": 1389756389308,
    "timestamp": "2017-04-18T17:00:00.000Z"
  },
  {
    "bits_per_second": 2864457764,
    "bytes": 1289005993684,
    "timestamp": "2017-04-18T16:00:00.000Z"
  },
  {
    "bits_per_second": 2372233135,
    "bytes": 1067504910722,
    "timestamp": "2017-04-18T15:00:00.000Z"
  },
  {
    "bits_per_second": 2194454563,
    "bytes": 987504553176,
    "timestamp": "2017-04-18T14:00:00.000Z"
  },
  {
    "bits_per_second": 2394455437,
    "bytes": 1077504946463,
    "timestamp": "2017-04-18T13:00:00.000Z"
  },
  {
    "bits_per_second": 2240565904,
    "bytes": 1008254656808,
    "timestamp": "2017-04-18T12:00:00.000Z"
  },
  {
    "bits_per_second": 1838341763,
    "bytes": 827253793205,
    "timestamp": "2017-04-18T11:00:00.000Z"
  },
  {
    "bits_per_second": 1737230258,
    "bytes": 781753615910,
    "timestamp": "2017-04-18T10:00:00.000Z"
  },
  {
    "bits_per_second": 1477229046,
    "bytes": 664753070825,
    "timestamp": "2017-04-18T09:00:00.000Z"
  },
  {
    "bits_per_second": 1495562411,
    "bytes": 673003084913,
    "timestamp": "2017-04-18T08:00:00.000Z"
  },
  {
    "bits_per_second": 1755563539,
    "bytes": 790003592651,
    "timestamp": "2017-04-18T07:00:00.000Z"
  },
  {
    "bits_per_second": 1849452920,
    "bytes": 832253813917,
    "timestamp": "2017-04-18T06:00:00.000Z"
  },
  {
    "bits_per_second": 1994453545,
    "bytes": 897504095397,
    "timestamp": "2017-04-18T05:00:00.000Z"
  },
  {
    "bits_per_second": 2163898921,
    "bytes": 973754514666,
    "timestamp": "2017-04-18T04:00:00.000Z"
  },
  {
    "bits_per_second": 2241677035,
    "bytes": 1008754665713,
    "timestamp": "2017-04-18T03:00:00.000Z"
  },
  {
    "bits_per_second": 2428900179,
    "bytes": 1093005080770,
    "timestamp": "2017-04-18T02:00:00.000Z"
  },
  {
    "bits_per_second": 2757234915,
    "bytes": 1240755711749,
    "timestamp": "2017-04-18T01:00:00.000Z"
  },
  {
    "bits_per_second": 2884457662,
    "bytes": 1298005947756,
    "timestamp": "2017-04-18T00:00:00.000Z"
  },
  {
    "bits_per_second": 3043347386,
    "bytes": 1369506323647,
    "timestamp": "2017-04-17T23:00:00.000Z"
  },
  {
    "bits_per_second": 3130570085,
    "bytes": 1408756538098,
    "timestamp": "2017-04-17T22:00:00.000Z"
  },
  {
    "bits_per_second": 2956680370,
    "bytes": 1330506166379,
    "timestamp": "2017-04-17T21:00:00.000Z"
  },
  {
    "bits_per_second": 2942235758,
    "bytes": 1324006091137,
    "timestamp": "2017-04-17T20:00:00.000Z"
  },
  {
    "bits_per_second": 2849457673,
    "bytes": 1282255952695,
    "timestamp": "2017-04-17T19:00:00.000Z"
  },
  {
    "bits_per_second": 2770012771,
    "bytes": 1246505746764,
    "timestamp": "2017-04-17T18:00:00.000Z"
  },
  {
    "bits_per_second": 2575567415,
    "bytes": 1159005336889,
    "timestamp": "2017-04-17T17:00:00.000Z"
  },
  {
    "bits_per_second": 2410011031,
    "bytes": 1084504963898,
    "timestamp": "2017-04-17T16:00:00.000Z"
  },
  {
    "bits_per_second": 2410566721,
    "bytes": 1084755024674,
    "timestamp": "2017-04-17T15:00:00.000Z"
  },
  {
    "bits_per_second": 2213899027,
    "bytes": 996254562216,
    "timestamp": "2017-04-17T14:00:00.000Z"
  },
  {
    "bits_per_second": 2023898229,
    "bytes": 910754202958,
    "timestamp": "2017-04-17T13:00:00.000Z"
  },
  {
    "bits_per_second": 1846119634,
    "bytes": 830753835243,
    "timestamp": "2017-04-17T12:00:00.000Z"
  },
  {
    "bits_per_second": 1440006576,
    "bytes": 648002959407,
    "timestamp": "2017-04-17T11:00:00.000Z"
  },
  {
    "bits_per_second": 1326117265,
    "bytes": 596752769211,
    "timestamp": "2017-04-17T10:00:00.000Z"
  },
  {
    "bits_per_second": 1260005736,
    "bytes": 567002581286,
    "timestamp": "2017-04-17T09:00:00.000Z"
  },
  {
    "bits_per_second": 1268339125,
    "bytes": 570752606199,
    "timestamp": "2017-04-17T08:00:00.000Z"
  },
  {
    "bits_per_second": 1349450668,
    "bytes": 607252800755,
    "timestamp": "2017-04-17T07:00:00.000Z"
  },
  {
    "bits_per_second": 1486117984,
    "bytes": 668753092874,
    "timestamp": "2017-04-17T06:00:00.000Z"
  },
  {
    "bits_per_second": 1657785424,
    "bytes": 746003440894,
    "timestamp": "2017-04-17T05:00:00.000Z"
  },
  {
    "bits_per_second": 1838341818,
    "bytes": 827253818316,
    "timestamp": "2017-04-17T04:00:00.000Z"
  },
  {
    "bits_per_second": 2233899324,
    "bytes": 1005254695841,
    "timestamp": "2017-04-17T03:00:00.000Z"
  },
  {
    "bits_per_second": 2415011219,
    "bytes": 1086755048773,
    "timestamp": "2017-04-17T02:00:00.000Z"
  },
  {
    "bits_per_second": 2590567546,
    "bytes": 1165755395491,
    "timestamp": "2017-04-17T01:00:00.000Z"
  },
  {
    "bits_per_second": 2752790648,
    "bytes": 1238755791485,
    "timestamp": "2017-04-17T00:00:00.000Z"
  },
  {
    "bits_per_second": 2990569145,
    "bytes": 1345756115149,
    "timestamp": "2017-04-16T23:00:00.000Z"
  },
  {
    "bits_per_second": 3083903124,
    "bytes": 1387756405754,
    "timestamp": "2017-04-16T22:00:00.000Z"
  },
  {
    "bits_per_second": 3058903157,
    "bytes": 1376506420449,
    "timestamp": "2017-04-16T21:00:00.000Z"
  },
  {
    "bits_per_second": 2989458120,
    "bytes": 1345256154186,
    "timestamp": "2017-04-16T20:00:00.000Z"
  },
  {
    "bits_per_second": 2822790715,
    "bytes": 1270255821611,
    "timestamp": "2017-04-16T19:00:00.000Z"
  },
  {
    "bits_per_second": 2738901490,
    "bytes": 1232505670419,
    "timestamp": "2017-04-16T18:00:00.000Z"
  },
  {
    "bits_per_second": 2562789623,
    "bytes": 1153255330284,
    "timestamp": "2017-04-16T17:00:00.000Z"
  },
  {
    "bits_per_second": 2418899995,
    "bytes": 1088504997870,
    "timestamp": "2017-04-16T16:00:00.000Z"
  },
  {
    "bits_per_second": 2356121851,
    "bytes": 1060254833038,
    "timestamp": "2017-04-16T15:00:00.000Z"
  },
  {
    "bits_per_second": 2188898955,
    "bytes": 985004529653,
    "timestamp": "2017-04-16T14:00:00.000Z"
  },
  {
    "bits_per_second": 2008342680,
    "bytes": 903754206147,
    "timestamp": "2017-04-16T13:00:00.000Z"
  },
  {
    "bits_per_second": 1817230552,
    "bytes": 817753748303,
    "timestamp": "2017-04-16T12:00:00.000Z"
  },
  {
    "bits_per_second": 1426117623,
    "bytes": 641752930399,
    "timestamp": "2017-04-16T11:00:00.000Z"
  },
  {
    "bits_per_second": 1323339401,
    "bytes": 595502730341,
    "timestamp": "2017-04-16T10:00:00.000Z"
  },
  {
    "bits_per_second": 1530007003,
    "bytes": 688503151293,
    "timestamp": "2017-04-16T09:00:00.000Z"
  },
  {
    "bits_per_second": 1543340436,
    "bytes": 694503196054,
    "timestamp": "2017-04-16T08:00:00.000Z"
  },
  {
    "bits_per_second": 1344450599,
    "bytes": 605002769422,
    "timestamp": "2017-04-16T07:00:00.000Z"
  },
  {
    "bits_per_second": 1415006531,
    "bytes": 636752938966,
    "timestamp": "2017-04-16T06:00:00.000Z"
  },
  {
    "bits_per_second": 1638896482,
    "bytes": 737503416819,
    "timestamp": "2017-04-16T05:00:00.000Z"
  },
  {
    "bits_per_second": 1790008142,
    "bytes": 805503663999,
    "timestamp": "2017-04-16T04:00:00.000Z"
  },
  {
    "bits_per_second": 2217232612,
    "bytes": 997754675222,
    "timestamp": "2017-04-16T03:00:00.000Z"
  },
  {
    "bits_per_second": 2366122085,
    "bytes": 1064754938244,
    "timestamp": "2017-04-16T02:00:00.000Z"
  },
  {
    "bits_per_second": 2570011970,
    "bytes": 1156505386603,
    "timestamp": "2017-04-16T01:00:00.000Z"
  },
  {
    "bits_per_second": 2753901552,
    "bytes": 1239255698242,
    "timestamp": "2017-04-16T00:00:00.000Z"
  },
  {
    "bits_per_second": 2786124042,
    "bytes": 1253755819002,
    "timestamp": "2017-04-15T23:00:00.000Z"
  },
  {
    "bits_per_second": 2881679857,
    "bytes": 1296755935812,
    "timestamp": "2017-04-15T22:00:00.000Z"
  },
  {
    "bits_per_second": 3163903461,
    "bytes": 1423756557593,
    "timestamp": "2017-04-15T21:00:00.000Z"
  },
  {
    "bits_per_second": 3154458915,
    "bytes": 1419506511840,
    "timestamp": "2017-04-15T20:00:00.000Z"
  },
  {
    "bits_per_second": 3142236676,
    "bytes": 1414006504411,
    "timestamp": "2017-04-15T19:00:00.000Z"
  },
  {
    "bits_per_second": 3040013921,
    "bytes": 1368006264548,
    "timestamp": "2017-04-15T18:00:00.000Z"
  },
  {
    "bits_per_second": 2888346714,
    "bytes": 1299756021206,
    "timestamp": "2017-04-15T17:00:00.000Z"
  },
  {
    "bits_per_second": 2720568116,
    "bytes": 1224255652003,
    "timestamp": "2017-04-15T16:00:00.000Z"
  },
  {
    "bits_per_second": 2555011844,
    "bytes": 1149755329868,
    "timestamp": "2017-04-15T15:00:00.000Z"
  },
  {
    "bits_per_second": 2387233156,
    "bytes": 1074254920154,
    "timestamp": "2017-04-15T14:00:00.000Z"
  },
  {
    "bits_per_second": 2232788116,
    "bytes": 1004754652033,
    "timestamp": "2017-04-15T13:00:00.000Z"
  },
  {
    "bits_per_second": 2079454070,
    "bytes": 935754331663,
    "timestamp": "2017-04-15T12:00:00.000Z"
  },
  {
    "bits_per_second": 1702230175,
    "bytes": 766003578614,
    "timestamp": "2017-04-15T11:00:00.000Z"
  },
  {
    "bits_per_second": 1607229661,
    "bytes": 723253347332,
    "timestamp": "2017-04-15T10:00:00.000Z"
  },
  {
    "bits_per_second": 1828897242,
    "bytes": 823003758848,
    "timestamp": "2017-04-15T09:00:00.000Z"
  },
  {
    "bits_per_second": 1797786063,
    "bytes": 809003728236,
    "timestamp": "2017-04-15T08:00:00.000Z"
  },
  {
    "bits_per_second": 1640007589,
    "bytes": 738003414942,
    "timestamp": "2017-04-15T07:00:00.000Z"
  },
  {
    "bits_per_second": 1721119105,
    "bytes": 774503597164,
    "timestamp": "2017-04-15T06:00:00.000Z"
  },
  {
    "bits_per_second": 1885008673,
    "bytes": 848253902901,
    "timestamp": "2017-04-15T05:00:00.000Z"
  },
  {
    "bits_per_second": 2024453634,
    "bytes": 911004135085,
    "timestamp": "2017-04-15T04:00:00.000Z"
  },
  {
    "bits_per_second": 2057787279,
    "bytes": 926004275441,
    "timestamp": "2017-04-15T03:00:00.000Z"
  },
  {
    "bits_per_second": 2227232481,
    "bytes": 1002254616271,
    "timestamp": "2017-04-15T02:00:00.000Z"
  },
  {
    "bits_per_second": 2587789739,
    "bytes": 1164505382416,
    "timestamp": "2017-04-15T01:00:00.000Z"
  },
  {
    "bits_per_second": 2782790528,
    "bytes": 1252255737644,
    "timestamp": "2017-04-15T00:00:00.000Z"
  },
  {
    "bits_per_second": 3166681180,
    "bytes": 1425006531126,
    "timestamp": "2017-04-14T23:00:00.000Z"
  },
  {
    "bits_per_second": 3261126177,
    "bytes": 1467506779634,
    "timestamp": "2017-04-14T22:00:00.000Z"
  },
  {
    "bits_per_second": 3373348832,
    "bytes": 1518006974493,
    "timestamp": "2017-04-14T21:00:00.000Z"
  },
  {
    "bits_per_second": 3336682026,
    "bytes": 1501506911587,
    "timestamp": "2017-04-14T20:00:00.000Z"
  },
  {
    "bits_per_second": 3072792000,
    "bytes": 1382756399944,
    "timestamp": "2017-04-14T19:00:00.000Z"
  },
  {
    "bits_per_second": 3006680416,
    "bytes": 1353006187268,
    "timestamp": "2017-04-14T18:00:00.000Z"
  },
  {
    "bits_per_second": 3107792159,
    "bytes": 1398506471592,
    "timestamp": "2017-04-14T17:00:00.000Z"
  },
  {
    "bits_per_second": 2942235683,
    "bytes": 1324006057415,
    "timestamp": "2017-04-14T16:00:00.000Z"
  },
  {
    "bits_per_second": 2382788756,
    "bytes": 1072254940100,
    "timestamp": "2017-04-14T15:00:00.000Z"
  },
  {
    "bits_per_second": 2193343595,
    "bytes": 987004617805,
    "timestamp": "2017-04-14T14:00:00.000Z"
  },
  {
    "bits_per_second": 2208898978,
    "bytes": 994004540251,
    "timestamp": "2017-04-14T13:00:00.000Z"
  },
  {
    "bits_per_second": 1999453532,
    "bytes": 899754089501,
    "timestamp": "2017-04-14T12:00:00.000Z"
  },
  {
    "bits_per_second": 2067787385,
    "bytes": 930504323076,
    "timestamp": "2017-04-14T11:00:00.000Z"
  },
  {
    "bits_per_second": 1985564765,
    "bytes": 893504144166,
    "timestamp": "2017-04-14T10:00:00.000Z"
  },
  {
    "bits_per_second": 2000009128,
    "bytes": 900004107736,
    "timestamp": "2017-04-14T09:00:00.000Z"
  },
  {
    "bits_per_second": 2008898165,
    "bytes": 904004174417,
    "timestamp": "2017-04-14T08:00:00.000Z"
  },
  {
    "bits_per_second": 1530007113,
    "bytes": 688503200787,
    "timestamp": "2017-04-14T07:00:00.000Z"
  },
  {
    "bits_per_second": 1673896634,
    "bytes": 753253485506,
    "timestamp": "2017-04-14T06:00:00.000Z"
  },
  {
    "bits_per_second": 1863341788,
    "bytes": 838503804501,
    "timestamp": "2017-04-14T05:00:00.000Z"
  },
  {
    "bits_per_second": 2014453740,
    "bytes": 906504182799,
    "timestamp": "2017-04-14T04:00:00.000Z"
  },
  {
    "bits_per_second": 2490567129,
    "bytes": 1120755207946,
    "timestamp": "2017-04-14T03:00:00.000Z"
  },
  {
    "bits_per_second": 2729456960,
    "bytes": 1228255632020,
    "timestamp": "2017-04-14T02:00:00.000Z"
  },
  {
    "bits_per_second": 2788346197,
    "bytes": 1254755788510,
    "timestamp": "2017-04-14T01:00:00.000Z"
  },
  {
    "bits_per_second": 2935569035,
    "bytes": 1321006065945,
    "timestamp": "2017-04-14T00:00:00.000Z"
  },
  {
    "bits_per_second": 3167792400,
    "bytes": 1425506580118,
    "timestamp": "2017-04-13T23:00:00.000Z"
  },
  {
    "bits_per_second": 3280570734,
    "bytes": 1476256830363,
    "timestamp": "2017-04-13T22:00:00.000Z"
  },
  {
    "bits_per_second": 3086680823,
    "bytes": 1389006370304,
    "timestamp": "2017-04-13T21:00:00.000Z"
  },
  {
    "bits_per_second": 3151681195,
    "bytes": 1418256537702,
    "timestamp": "2017-04-13T20:00:00.000Z"
  },
  {
    "bits_per_second": 3291126292,
    "bytes": 1481006831317,
    "timestamp": "2017-04-13T19:00:00.000Z"
  },
  {
    "bits_per_second": 3192792477,
    "bytes": 1436756614555,
    "timestamp": "2017-04-13T18:00:00.000Z"
  },
  {
    "bits_per_second": 2751679302,
    "bytes": 1238255686099,
    "timestamp": "2017-04-13T17:00:00.000Z"
  },
  {
    "bits_per_second": 2590567580,
    "bytes": 1165755410812,
    "timestamp": "2017-04-13T16:00:00.000Z"
  },
  {
    "bits_per_second": 2349455154,
    "bytes": 1057254819276,
    "timestamp": "2017-04-13T15:00:00.000Z"
  },
  {
    "bits_per_second": 2152787734,
    "bytes": 968754480459,
    "timestamp": "2017-04-13T14:00:00.000Z"
  },
  {
    "bits_per_second": 1886119714,
    "bytes": 848753871488,
    "timestamp": "2017-04-13T13:00:00.000Z"
  },
  {
    "bits_per_second": 1722230217,
    "bytes": 775003597455,
    "timestamp": "2017-04-13T12:00:00.000Z"
  },
  {
    "bits_per_second": 1620007477,
    "bytes": 729003364678,
    "timestamp": "2017-04-13T11:00:00.000Z"
  },
  {
    "bits_per_second": 1529451459,
    "bytes": 688253156479,
    "timestamp": "2017-04-13T10:00:00.000Z"
  },
  {
    "bits_per_second": 1929453275,
    "bytes": 868253973762,
    "timestamp": "2017-04-13T09:00:00.000Z"
  },
  {
    "bits_per_second": 1916675495,
    "bytes": 862503972711,
    "timestamp": "2017-04-13T08:00:00.000Z"
  },
  {
    "bits_per_second": 1744452538,
    "bytes": 785003642220,
    "timestamp": "2017-04-13T07:00:00.000Z"
  },
  {
    "bits_per_second": 1844452900,
    "bytes": 830003804998,
    "timestamp": "2017-04-13T06:00:00.000Z"
  },
  {
    "bits_per_second": 1801119498,
    "bytes": 810503774070,
    "timestamp": "2017-04-13T05:00:00.000Z"
  },
  {
    "bits_per_second": 1943897767,
    "bytes": 874753995051,
    "timestamp": "2017-04-13T04:00:00.000Z"
  },
  {
    "bits_per_second": 2228899161,
    "bytes": 1003004622245,
    "timestamp": "2017-04-13T03:00:00.000Z"
  },
  {
    "bits_per_second": 2417233495,
    "bytes": 1087755072687,
    "timestamp": "2017-04-13T02:00:00.000Z"
  },
  {
    "bits_per_second": 2729456976,
    "bytes": 1228255639002,
    "timestamp": "2017-04-13T01:00:00.000Z"
  },
  {
    "bits_per_second": 2903346760,
    "bytes": 1306506042178,
    "timestamp": "2017-04-13T00:00:00.000Z"
  },
  {
    "bits_per_second": 3007791618,
    "bytes": 1353506227893,
    "timestamp": "2017-04-12T23:00:00.000Z"
  },
  {
    "bits_per_second": 3049458406,
    "bytes": 1372256282489,
    "timestamp": "2017-04-12T22:00:00.000Z"
  },
  {
    "bits_per_second": 3339459830,
    "bytes": 1502756923461,
    "timestamp": "2017-04-12T21:00:00.000Z"
  },
  {
    "bits_per_second": 3285015123,
    "bytes": 1478256805415,
    "timestamp": "2017-04-12T20:00:00.000Z"
  },
  {
    "bits_per_second": 2994458223,
    "bytes": 1347506200298,
    "timestamp": "2017-04-12T19:00:00.000Z"
  },
  {
    "bits_per_second": 2902791198,
    "bytes": 1306256038946,
    "timestamp": "2017-04-12T18:00:00.000Z"
  },
  {
    "bits_per_second": 2740012604,
    "bytes": 1233005671691,
    "timestamp": "2017-04-12T17:00:00.000Z"
  },
  {
    "bits_per_second": 2578900745,
    "bytes": 1160505335150,
    "timestamp": "2017-04-12T16:00:00.000Z"
  },
  {
    "bits_per_second": 2353899674,
    "bytes": 1059254853308,
    "timestamp": "2017-04-12T15:00:00.000Z"
  },
  {
    "bits_per_second": 2181121250,
    "bytes": 981504562314,
    "timestamp": "2017-04-12T14:00:00.000Z"
  },
  {
    "bits_per_second": 2383899886,
    "bytes": 1072754948659,
    "timestamp": "2017-04-12T13:00:00.000Z"
  },
  {
    "bits_per_second": 2227788112,
    "bytes": 1002504650574,
    "timestamp": "2017-04-12T12:00:00.000Z"
  },
  {
    "bits_per_second": 1850008504,
    "bytes": 832503826627,
    "timestamp": "2017-04-12T11:00:00.000Z"
  },
  {
    "bits_per_second": 1743341340,
    "bytes": 784503602778,
    "timestamp": "2017-04-12T10:00:00.000Z"
  },
  {
    "bits_per_second": 1710007846,
    "bytes": 769503530555,
    "timestamp": "2017-04-12T09:00:00.000Z"
  },
  {
    "bits_per_second": 1721674607,
    "bytes": 774753573135,
    "timestamp": "2017-04-12T08:00:00.000Z"
  },
  {
    "bits_per_second": 1769452588,
    "bytes": 796253664819,
    "timestamp": "2017-04-12T07:00:00.000Z"
  },
  {
    "bits_per_second": 1860008611,
    "bytes": 837003874769,
    "timestamp": "2017-04-12T06:00:00.000Z"
  },
  {
    "bits_per_second": 1813897203,
    "bytes": 816253741437,
    "timestamp": "2017-04-12T05:00:00.000Z"
  },
  {
    "bits_per_second": 1970564581,
    "bytes": 886754061447,
    "timestamp": "2017-04-12T04:00:00.000Z"
  },
  {
    "bits_per_second": 2355566401,
    "bytes": 1060004880480,
    "timestamp": "2017-04-12T03:00:00.000Z"
  },
  {
    "bits_per_second": 2556678335,
    "bytes": 1150505250577,
    "timestamp": "2017-04-12T02:00:00.000Z"
  },
  {
    "bits_per_second": 2752234797,
    "bytes": 1238505658582,
    "timestamp": "2017-04-12T01:00:00.000Z"
  },
  {
    "bits_per_second": 2917791219,
    "bytes": 1313006048446,
    "timestamp": "2017-04-12T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-04-11T23:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-04-11T22:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-04-11T21:00:00.000Z"
  },
  {
    "bits_per_second": 1716674596,
    "bytes": 772503568061,
    "timestamp": "2017-04-11T20:00:00.000Z"
  },
  {
    "bits_per_second": 3162792532,
    "bytes": 1423256639260,
    "timestamp": "2017-04-11T19:00:00.000Z"
  },
  {
    "bits_per_second": 3109458873,
    "bytes": 1399256492709,
    "timestamp": "2017-04-11T18:00:00.000Z"
  },
  {
    "bits_per_second": 2684456962,
    "bytes": 1208005632995,
    "timestamp": "2017-04-11T17:00:00.000Z"
  },
  {
    "bits_per_second": 2489455881,
    "bytes": 1120255146227,
    "timestamp": "2017-04-11T16:00:00.000Z"
  },
  {
    "bits_per_second": 2679456837,
    "bytes": 1205755576766,
    "timestamp": "2017-04-11T15:00:00.000Z"
  },
  {
    "bits_per_second": 2495011533,
    "bytes": 1122755189703,
    "timestamp": "2017-04-11T14:00:00.000Z"
  },
  {
    "bits_per_second": 1830008368,
    "bytes": 823503765523,
    "timestamp": "2017-04-11T13:00:00.000Z"
  },
  {
    "bits_per_second": 1650563013,
    "bytes": 742753355966,
    "timestamp": "2017-04-11T12:00:00.000Z"
  },
  {
    "bits_per_second": 1517229211,
    "bytes": 682753144829,
    "timestamp": "2017-04-11T11:00:00.000Z"
  },
  {
    "bits_per_second": 1445006604,
    "bytes": 650252971758,
    "timestamp": "2017-04-11T10:00:00.000Z"
  },
  {
    "bits_per_second": 1847786397,
    "bytes": 831503878458,
    "timestamp": "2017-04-11T09:00:00.000Z"
  },
  {
    "bits_per_second": 1852786267,
    "bytes": 833753820072,
    "timestamp": "2017-04-11T08:00:00.000Z"
  },
  {
    "bits_per_second": 1864453097,
    "bytes": 839003893789,
    "timestamp": "2017-04-11T07:00:00.000Z"
  },
  {
    "bits_per_second": 1983897905,
    "bytes": 892754057349,
    "timestamp": "2017-04-11T06:00:00.000Z"
  },
  {
    "bits_per_second": 2079454078,
    "bytes": 935754335089,
    "timestamp": "2017-04-11T05:00:00.000Z"
  },
  {
    "bits_per_second": 2259454827,
    "bytes": 1016754672333,
    "timestamp": "2017-04-11T04:00:00.000Z"
  },
  {
    "bits_per_second": 2450566712,
    "bytes": 1102755020601,
    "timestamp": "2017-04-11T03:00:00.000Z"
  },
  {
    "bits_per_second": 2621123239,
    "bytes": 1179505457588,
    "timestamp": "2017-04-11T02:00:00.000Z"
  },
  {
    "bits_per_second": 2670012318,
    "bytes": 1201505543118,
    "timestamp": "2017-04-11T01:00:00.000Z"
  },
  {
    "bits_per_second": 2830568587,
    "bytes": 1273755864181,
    "timestamp": "2017-04-11T00:00:00.000Z"
  },
  {
    "bits_per_second": 2789457363,
    "bytes": 1255255813164,
    "timestamp": "2017-04-10T23:00:00.000Z"
  },
  {
    "bits_per_second": 2951680403,
    "bytes": 1328256181315,
    "timestamp": "2017-04-10T22:00:00.000Z"
  },
  {
    "bits_per_second": 3671683571,
    "bytes": 1652257606950,
    "timestamp": "2017-04-10T21:00:00.000Z"
  },
  {
    "bits_per_second": 3173347996,
    "bytes": 1428006598121,
    "timestamp": "2017-04-10T20:00:00.000Z"
  },
  {
    "bits_per_second": 2855568819,
    "bytes": 1285005968703,
    "timestamp": "2017-04-10T19:00:00.000Z"
  },
  {
    "bits_per_second": 2778346176,
    "bytes": 1250255779065,
    "timestamp": "2017-04-10T18:00:00.000Z"
  },
  {
    "bits_per_second": 2755568320,
    "bytes": 1240005743934,
    "timestamp": "2017-04-10T17:00:00.000Z"
  },
  {
    "bits_per_second": 2582234148,
    "bytes": 1162005366647,
    "timestamp": "2017-04-10T16:00:00.000Z"
  },
  {
    "bits_per_second": 2581678646,
    "bytes": 1161755390850,
    "timestamp": "2017-04-10T15:00:00.000Z"
  },
  {
    "bits_per_second": 2399455399,
    "bytes": 1079754929649,
    "timestamp": "2017-04-10T14:00:00.000Z"
  },
  {
    "bits_per_second": 2058342783,
    "bytes": 926254252546,
    "timestamp": "2017-04-10T13:00:00.000Z"
  },
  {
    "bits_per_second": 1818897268,
    "bytes": 818503770687,
    "timestamp": "2017-04-10T12:00:00.000Z"
  },
  {
    "bits_per_second": 1455562313,
    "bytes": 655003040693,
    "timestamp": "2017-04-10T11:00:00.000Z"
  },
  {
    "bits_per_second": 1362784114,
    "bytes": 613252851205,
    "timestamp": "2017-04-10T10:00:00.000Z"
  },
  {
    "bits_per_second": 1555562690,
    "bytes": 700003210282,
    "timestamp": "2017-04-10T09:00:00.000Z"
  },
  {
    "bits_per_second": 1554451599,
    "bytes": 699503219447,
    "timestamp": "2017-04-10T08:00:00.000Z"
  },
  {
    "bits_per_second": 1399450889,
    "bytes": 629752900047,
    "timestamp": "2017-04-10T07:00:00.000Z"
  },
  {
    "bits_per_second": 1483895696,
    "bytes": 667753063383,
    "timestamp": "2017-04-10T06:00:00.000Z"
  },
  {
    "bits_per_second": 1878897506,
    "bytes": 845503877485,
    "timestamp": "2017-04-10T05:00:00.000Z"
  },
  {
    "bits_per_second": 2009453739,
    "bytes": 904254182764,
    "timestamp": "2017-04-10T04:00:00.000Z"
  },
  {
    "bits_per_second": 2224454683,
    "bytes": 1001004607157,
    "timestamp": "2017-04-10T03:00:00.000Z"
  },
  {
    "bits_per_second": 2432233405,
    "bytes": 1094505032471,
    "timestamp": "2017-04-10T02:00:00.000Z"
  },
  {
    "bits_per_second": 2566678637,
    "bytes": 1155005386450,
    "timestamp": "2017-04-10T01:00:00.000Z"
  },
  {
    "bits_per_second": 2759457186,
    "bytes": 1241755733504,
    "timestamp": "2017-04-10T00:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-04-09T23:00:00.000Z"
  },
  {
    "bits_per_second": 1700007828,
    "bytes": 765003522788,
    "timestamp": "2017-04-09T22:00:00.000Z"
  },
  {
    "bits_per_second": 2844457570,
    "bytes": 1280005906390,
    "timestamp": "2017-04-09T21:00:00.000Z"
  },
  {
    "bits_per_second": 2880013195,
    "bytes": 1296005937845,
    "timestamp": "2017-04-09T20:00:00.000Z"
  },
  {
    "bits_per_second": 2961124883,
    "bytes": 1332506197286,
    "timestamp": "2017-04-09T19:00:00.000Z"
  },
  {
    "bits_per_second": 2844457642,
    "bytes": 1280005938848,
    "timestamp": "2017-04-09T18:00:00.000Z"
  },
  {
    "bits_per_second": 2395566535,
    "bytes": 1078004940974,
    "timestamp": "2017-04-09T17:00:00.000Z"
  },
  {
    "bits_per_second": 2233343604,
    "bytes": 1005004621822,
    "timestamp": "2017-04-09T16:00:00.000Z"
  },
  {
    "bits_per_second": 2475011558,
    "bytes": 1113755201289,
    "timestamp": "2017-04-09T15:00:00.000Z"
  },
  {
    "bits_per_second": 2282232672,
    "bytes": 1027004702597,
    "timestamp": "2017-04-09T14:00:00.000Z"
  },
  {
    "bits_per_second": 1543340365,
    "bytes": 694503164361,
    "timestamp": "2017-04-09T13:00:00.000Z"
  },
  {
    "bits_per_second": 1387784209,
    "bytes": 624502894162,
    "timestamp": "2017-04-09T12:00:00.000Z"
  },
  {
    "bits_per_second": 1264450228,
    "bytes": 569002602669,
    "timestamp": "2017-04-09T11:00:00.000Z"
  },
  {
    "bits_per_second": 1155560856,
    "bytes": 520002385220,
    "timestamp": "2017-04-09T10:00:00.000Z"
  },
  {
    "bits_per_second": 1641674196,
    "bytes": 738753388152,
    "timestamp": "2017-04-09T09:00:00.000Z"
  },
  {
    "bits_per_second": 1647785361,
    "bytes": 741503412618,
    "timestamp": "2017-04-09T08:00:00.000Z"
  },
  {
    "bits_per_second": 1417784334,
    "bytes": 638002950366,
    "timestamp": "2017-04-09T07:00:00.000Z"
  },
  {
    "bits_per_second": 1521118152,
    "bytes": 684503168234,
    "timestamp": "2017-04-09T06:00:00.000Z"
  },
  {
    "bits_per_second": 1871119715,
    "bytes": 842003871922,
    "timestamp": "2017-04-09T05:00:00.000Z"
  },
  {
    "bits_per_second": 2060565106,
    "bytes": 927254297642,
    "timestamp": "2017-04-09T04:00:00.000Z"
  },
  {
    "bits_per_second": 2007231522,
    "bytes": 903254184898,
    "timestamp": "2017-04-09T03:00:00.000Z"
  },
  {
    "bits_per_second": 2186676790,
    "bytes": 984004555375,
    "timestamp": "2017-04-09T02:00:00.000Z"
  },
  {
    "bits_per_second": 2375010801,
    "bytes": 1068754860359,
    "timestamp": "2017-04-09T01:00:00.000Z"
  },
  {
    "bits_per_second": 2590011898,
    "bytes": 1165505354141,
    "timestamp": "2017-04-09T00:00:00.000Z"
  },
  {
    "bits_per_second": 2775568247,
    "bytes": 1249005711358,
    "timestamp": "2017-04-08T23:00:00.000Z"
  },
  {
    "bits_per_second": 2922791229,
    "bytes": 1315256053089,
    "timestamp": "2017-04-08T22:00:00.000Z"
  },
  {
    "bits_per_second": 2960013664,
    "bytes": 1332006148705,
    "timestamp": "2017-04-08T21:00:00.000Z"
  },
  {
    "bits_per_second": 2963347087,
    "bytes": 1333506189135,
    "timestamp": "2017-04-08T20:00:00.000Z"
  },
  {
    "bits_per_second": 2868902075,
    "bytes": 1291005933743,
    "timestamp": "2017-04-08T19:00:00.000Z"
  },
  {
    "bits_per_second": 2787790648,
    "bytes": 1254505791422,
    "timestamp": "2017-04-08T18:00:00.000Z"
  },
  {
    "bits_per_second": 2650012196,
    "bytes": 1192505488086,
    "timestamp": "2017-04-08T17:00:00.000Z"
  },
  {
    "bits_per_second": 2460566786,
    "bytes": 1107255053632,
    "timestamp": "2017-04-08T16:00:00.000Z"
  },
  {
    "bits_per_second": 2050564905,
    "bytes": 922754207115,
    "timestamp": "2017-04-08T15:00:00.000Z"
  },
  {
    "bits_per_second": 1865008521,
    "bytes": 839253834334,
    "timestamp": "2017-04-08T14:00:00.000Z"
  },
  {
    "bits_per_second": 1622229699,
    "bytes": 730003364416,
    "timestamp": "2017-04-08T13:00:00.000Z"
  },
  {
    "bits_per_second": 1460562166,
    "bytes": 657252974676,
    "timestamp": "2017-04-08T12:00:00.000Z"
  },
  {
    "bits_per_second": 1338895060,
    "bytes": 602502777156,
    "timestamp": "2017-04-08T11:00:00.000Z"
  },
  {
    "bits_per_second": 1253339182,
    "bytes": 564002631752,
    "timestamp": "2017-04-08T10:00:00.000Z"
  },
  {
    "bits_per_second": 1685563344,
    "bytes": 758503504716,
    "timestamp": "2017-04-08T09:00:00.000Z"
  },
  {
    "bits_per_second": 1680007809,
    "bytes": 756003514212,
    "timestamp": "2017-04-08T08:00:00.000Z"
  },
  {
    "bits_per_second": 1771119272,
    "bytes": 797003672576,
    "timestamp": "2017-04-08T07:00:00.000Z"
  },
  {
    "bits_per_second": 1870564177,
    "bytes": 841753879699,
    "timestamp": "2017-04-08T06:00:00.000Z"
  },
  {
    "bits_per_second": 1753897117,
    "bytes": 789253702809,
    "timestamp": "2017-04-08T05:00:00.000Z"
  },
  {
    "bits_per_second": 1927231173,
    "bytes": 867254027678,
    "timestamp": "2017-04-08T04:00:00.000Z"
  },
  {
    "bits_per_second": 2301677302,
    "bytes": 1035754786057,
    "timestamp": "2017-04-08T03:00:00.000Z"
  },
  {
    "bits_per_second": 2432233432,
    "bytes": 1094505044372,
    "timestamp": "2017-04-08T02:00:00.000Z"
  },
  {
    "bits_per_second": 2492789225,
    "bytes": 1121755151402,
    "timestamp": "2017-04-08T01:00:00.000Z"
  },
  {
    "bits_per_second": 2625567842,
    "bytes": 1181505528917,
    "timestamp": "2017-04-08T00:00:00.000Z"
  },
  {
    "bits_per_second": 2810568580,
    "bytes": 1264755860794,
    "timestamp": "2017-04-07T23:00:00.000Z"
  },
  {
    "bits_per_second": 2917791225,
    "bytes": 1313006051358,
    "timestamp": "2017-04-07T22:00:00.000Z"
  },
  {
    "bits_per_second": 3185570261,
    "bytes": 1433506617287,
    "timestamp": "2017-04-07T21:00:00.000Z"
  },
  {
    "bits_per_second": 3151681238,
    "bytes": 1418256557313,
    "timestamp": "2017-04-07T20:00:00.000Z"
  },
  {
    "bits_per_second": 3037236161,
    "bytes": 1366756272327,
    "timestamp": "2017-04-07T19:00:00.000Z"
  },
  {
    "bits_per_second": 2930013521,
    "bytes": 1318506084231,
    "timestamp": "2017-04-07T18:00:00.000Z"
  },
  {
    "bits_per_second": 2750568204,
    "bytes": 1237755691960,
    "timestamp": "2017-04-07T17:00:00.000Z"
  },
  {
    "bits_per_second": 2586122991,
    "bytes": 1163755345922,
    "timestamp": "2017-04-07T16:00:00.000Z"
  },
  {
    "bits_per_second": 2575012071,
    "bytes": 1158755431912,
    "timestamp": "2017-04-07T15:00:00.000Z"
  },
  {
    "bits_per_second": 2396677824,
    "bytes": 1078505020854,
    "timestamp": "2017-04-07T14:00:00.000Z"
  },
  {
    "bits_per_second": 2035564825,
    "bytes": 916004171443,
    "timestamp": "2017-04-07T13:00:00.000Z"
  },
  {
    "bits_per_second": 1838341913,
    "bytes": 827253860670,
    "timestamp": "2017-04-07T12:00:00.000Z"
  },
  {
    "bits_per_second": 1416673163,
    "bytes": 637502923517,
    "timestamp": "2017-04-07T11:00:00.000Z"
  },
  {
    "bits_per_second": 1329450572,
    "bytes": 598252757458,
    "timestamp": "2017-04-07T10:00:00.000Z"
  },
  {
    "bits_per_second": 1260561353,
    "bytes": 567252609004,
    "timestamp": "2017-04-07T09:00:00.000Z"
  },
  {
    "bits_per_second": 1308894978,
    "bytes": 589002739929,
    "timestamp": "2017-04-07T08:00:00.000Z"
  },
  {
    "bits_per_second": 1362784039,
    "bytes": 613252817706,
    "timestamp": "2017-04-07T07:00:00.000Z"
  },
  {
    "bits_per_second": 1477229057,
    "bytes": 664753075616,
    "timestamp": "2017-04-07T06:00:00.000Z"
  },
  {
    "bits_per_second": 1686674403,
    "bytes": 759003481135,
    "timestamp": "2017-04-07T05:00:00.000Z"
  },
  {
    "bits_per_second": 1817786145,
    "bytes": 818003765405,
    "timestamp": "2017-04-07T04:00:00.000Z"
  },
  {
    "bits_per_second": 2212788005,
    "bytes": 995754602026,
    "timestamp": "2017-04-07T03:00:00.000Z"
  },
  {
    "bits_per_second": 2389455417,
    "bytes": 1075254937553,
    "timestamp": "2017-04-07T02:00:00.000Z"
  },
  {
    "bits_per_second": 2616123271,
    "bytes": 1177255471967,
    "timestamp": "2017-04-07T01:00:00.000Z"
  },
  {
    "bits_per_second": 2752790434,
    "bytes": 1238755695240,
    "timestamp": "2017-04-07T00:00:00.000Z"
  },
  {
    "bits_per_second": 3013902721,
    "bytes": 1356256224653,
    "timestamp": "2017-04-06T23:00:00.000Z"
  },
  {
    "bits_per_second": 3146681150,
    "bytes": 1416006517446,
    "timestamp": "2017-04-06T22:00:00.000Z"
  },
  {
    "bits_per_second": 2971680366,
    "bytes": 1337256164629,
    "timestamp": "2017-04-06T21:00:00.000Z"
  },
  {
    "bits_per_second": 2990569371,
    "bytes": 1345756216828,
    "timestamp": "2017-04-06T20:00:00.000Z"
  },
  {
    "bits_per_second": 3161125735,
    "bytes": 1422506580744,
    "timestamp": "2017-04-06T19:00:00.000Z"
  },
  {
    "bits_per_second": 3058902867,
    "bytes": 1376506290003,
    "timestamp": "2017-04-06T18:00:00.000Z"
  },
  {
    "bits_per_second": 2755012698,
    "bytes": 1239755713926,
    "timestamp": "2017-04-06T17:00:00.000Z"
  },
  {
    "bits_per_second": 2591122957,
    "bytes": 1166005330471,
    "timestamp": "2017-04-06T16:00:00.000Z"
  },
  {
    "bits_per_second": 2240010260,
    "bytes": 1008004616944,
    "timestamp": "2017-04-06T15:00:00.000Z"
  },
  {
    "bits_per_second": 2065565003,
    "bytes": 929504251370,
    "timestamp": "2017-04-06T14:00:00.000Z"
  },
  {
    "bits_per_second": 2237787869,
    "bytes": 1007004541003,
    "timestamp": "2017-04-06T13:00:00.000Z"
  },
  {
    "bits_per_second": 2044453726,
    "bytes": 920004176490,
    "timestamp": "2017-04-06T12:00:00.000Z"
  },
  {
    "bits_per_second": 1976675762,
    "bytes": 889504092821,
    "timestamp": "2017-04-06T11:00:00.000Z"
  },
  {
    "bits_per_second": 1880008614,
    "bytes": 846003876373,
    "timestamp": "2017-04-06T10:00:00.000Z"
  },
  {
    "bits_per_second": 1573340609,
    "bytes": 708003274195,
    "timestamp": "2017-04-06T09:00:00.000Z"
  },
  {
    "bits_per_second": 1571673900,
    "bytes": 707253255095,
    "timestamp": "2017-04-06T08:00:00.000Z"
  },
  {
    "bits_per_second": 1436117761,
    "bytes": 646252992264,
    "timestamp": "2017-04-06T07:00:00.000Z"
  },
  {
    "bits_per_second": 1529451523,
    "bytes": 688253185353,
    "timestamp": "2017-04-06T06:00:00.000Z"
  },
  {
    "bits_per_second": 2083898639,
    "bytes": 937754387373,
    "timestamp": "2017-04-06T05:00:00.000Z"
  },
  {
    "bits_per_second": 2277788175,
    "bytes": 1025004678704,
    "timestamp": "2017-04-06T04:00:00.000Z"
  },
  {
    "bits_per_second": 2060565028,
    "bytes": 927254262647,
    "timestamp": "2017-04-06T03:00:00.000Z"
  },
  {
    "bits_per_second": 2230010283,
    "bytes": 1003504627140,
    "timestamp": "2017-04-06T02:00:00.000Z"
  },
  {
    "bits_per_second": 2622234347,
    "bytes": 1180005456160,
    "timestamp": "2017-04-06T01:00:00.000Z"
  },
  {
    "bits_per_second": 2746123781,
    "bytes": 1235755701505,
    "timestamp": "2017-04-06T00:00:00.000Z"
  },
  {
    "bits_per_second": 3058347435,
    "bytes": 1376256345836,
    "timestamp": "2017-04-05T23:00:00.000Z"
  },
  {
    "bits_per_second": 3166681156,
    "bytes": 1425006519992,
    "timestamp": "2017-04-05T22:00:00.000Z"
  },
  {
    "bits_per_second": 2980569341,
    "bytes": 1341256203263,
    "timestamp": "2017-04-05T21:00:00.000Z"
  },
  {
    "bits_per_second": 2953346876,
    "bytes": 1329006094405,
    "timestamp": "2017-04-05T20:00:00.000Z"
  },
  {
    "bits_per_second": 3048902909,
    "bytes": 1372006309008,
    "timestamp": "2017-04-05T19:00:00.000Z"
  },
  {
    "bits_per_second": 2951124585,
    "bytes": 1328006063445,
    "timestamp": "2017-04-05T18:00:00.000Z"
  },
  {
    "bits_per_second": 2826124127,
    "bytes": 1271755857330,
    "timestamp": "2017-04-05T17:00:00.000Z"
  },
  {
    "bits_per_second": 2608345403,
    "bytes": 1173755431368,
    "timestamp": "2017-04-05T16:00:00.000Z"
  },
  {
    "bits_per_second": 2230010370,
    "bytes": 1003504666648,
    "timestamp": "2017-04-05T15:00:00.000Z"
  },
  {
    "bits_per_second": 2068898509,
    "bytes": 931004329239,
    "timestamp": "2017-04-05T14:00:00.000Z"
  },
  {
    "bits_per_second": 2050009402,
    "bytes": 922504230897,
    "timestamp": "2017-04-05T13:00:00.000Z"
  },
  {
    "bits_per_second": 1872786414,
    "bytes": 842753886404,
    "timestamp": "2017-04-05T12:00:00.000Z"
  },
  {
    "bits_per_second": 1734452412,
    "bytes": 780503585559,
    "timestamp": "2017-04-05T11:00:00.000Z"
  },
  {
    "bits_per_second": 1628340875,
    "bytes": 732753393739,
    "timestamp": "2017-04-05T10:00:00.000Z"
  },
  {
    "bits_per_second": 1362228518,
    "bytes": 613002833036,
    "timestamp": "2017-04-05T09:00:00.000Z"
  },
  {
    "bits_per_second": 1377228579,
    "bytes": 619752860671,
    "timestamp": "2017-04-05T08:00:00.000Z"
  },
  {
    "bits_per_second": 1867786397,
    "bytes": 840503878603,
    "timestamp": "2017-04-05T07:00:00.000Z"
  },
  {
    "bits_per_second": 1982231331,
    "bytes": 892004099062,
    "timestamp": "2017-04-05T06:00:00.000Z"
  },
  {
    "bits_per_second": 1870564081,
    "bytes": 841753836356,
    "timestamp": "2017-04-05T05:00:00.000Z"
  },
  {
    "bits_per_second": 2066120597,
    "bytes": 929754268833,
    "timestamp": "2017-04-05T04:00:00.000Z"
  },
  {
    "bits_per_second": 2083898403,
    "bytes": 937754281187,
    "timestamp": "2017-04-05T03:00:00.000Z"
  },
  {
    "bits_per_second": 2258343729,
    "bytes": 1016254678271,
    "timestamp": "2017-04-05T02:00:00.000Z"
  },
  {
    "bits_per_second": 2641678882,
    "bytes": 1188755496914,
    "timestamp": "2017-04-05T01:00:00.000Z"
  },
  {
    "bits_per_second": 2806679511,
    "bytes": 1263005779984,
    "timestamp": "2017-04-05T00:00:00.000Z"
  },
  {
    "bits_per_second": 2990013587,
    "bytes": 1345506114062,
    "timestamp": "2017-04-04T23:00:00.000Z"
  },
  {
    "bits_per_second": 3145570035,
    "bytes": 1415506515655,
    "timestamp": "2017-04-04T22:00:00.000Z"
  },
  {
    "bits_per_second": 2958346905,
    "bytes": 1331256107417,
    "timestamp": "2017-04-04T21:00:00.000Z"
  },
  {
    "bits_per_second": 2947791251,
    "bytes": 1326506062852,
    "timestamp": "2017-04-04T20:00:00.000Z"
  },
  {
    "bits_per_second": 3016680471,
    "bytes": 1357506211787,
    "timestamp": "2017-04-04T19:00:00.000Z"
  },
  {
    "bits_per_second": 2899457903,
    "bytes": 1304756056179,
    "timestamp": "2017-04-04T18:00:00.000Z"
  },
  {
    "bits_per_second": 2912235598,
    "bytes": 1310506019127,
    "timestamp": "2017-04-04T17:00:00.000Z"
  },
  {
    "bits_per_second": 2764457275,
    "bytes": 1244005773608,
    "timestamp": "2017-04-04T16:00:00.000Z"
  },
  {
    "bits_per_second": 2593345297,
    "bytes": 1167005383534,
    "timestamp": "2017-04-04T15:00:00.000Z"
  },
  {
    "bits_per_second": 2413344513,
    "bytes": 1086005030852,
    "timestamp": "2017-04-04T14:00:00.000Z"
  },
  {
    "bits_per_second": 2006675862,
    "bytes": 903004137820,
    "timestamp": "2017-04-04T13:00:00.000Z"
  },
  {
    "bits_per_second": 1831119513,
    "bytes": 824003780648,
    "timestamp": "2017-04-04T12:00:00.000Z"
  },
  {
    "bits_per_second": 1703896836,
    "bytes": 766753576278,
    "timestamp": "2017-04-04T11:00:00.000Z"
  },
  {
    "bits_per_second": 1624451808,
    "bytes": 731003313711,
    "timestamp": "2017-04-04T10:00:00.000Z"
  },
  {
    "bits_per_second": 1567229548,
    "bytes": 705253296498,
    "timestamp": "2017-04-04T09:00:00.000Z"
  },
  {
    "bits_per_second": 1562229329,
    "bytes": 703003198232,
    "timestamp": "2017-04-04T08:00:00.000Z"
  },
  {
    "bits_per_second": 1614451861,
    "bytes": 726503337584,
    "timestamp": "2017-04-04T07:00:00.000Z"
  },
  {
    "bits_per_second": 1721119133,
    "bytes": 774503609892,
    "timestamp": "2017-04-04T06:00:00.000Z"
  },
  {
    "bits_per_second": 1638340846,
    "bytes": 737253380900,
    "timestamp": "2017-04-04T05:00:00.000Z"
  },
  {
    "bits_per_second": 1796119364,
    "bytes": 808253713631,
    "timestamp": "2017-04-04T04:00:00.000Z"
  },
  {
    "bits_per_second": 2073342857,
    "bytes": 933004285557,
    "timestamp": "2017-04-04T03:00:00.000Z"
  },
  {
    "bits_per_second": 2233343675,
    "bytes": 1005004653593,
    "timestamp": "2017-04-04T02:00:00.000Z"
  },
  {
    "bits_per_second": 2578900646,
    "bytes": 1160505290751,
    "timestamp": "2017-04-04T01:00:00.000Z"
  },
  {
    "bits_per_second": 2776679540,
    "bytes": 1249505792949,
    "timestamp": "2017-04-04T00:00:00.000Z"
  },
  {
    "bits_per_second": 2617789894,
    "bytes": 1178005452132,
    "timestamp": "2017-04-03T23:00:00.000Z"
  },
  {
    "bits_per_second": 2765012812,
    "bytes": 1244255765401,
    "timestamp": "2017-04-03T22:00:00.000Z"
  },
  {
    "bits_per_second": 3019458317,
    "bytes": 1358756242703,
    "timestamp": "2017-04-03T21:00:00.000Z"
  },
  {
    "bits_per_second": 3031125051,
    "bytes": 1364006272907,
    "timestamp": "2017-04-03T20:00:00.000Z"
  },
  {
    "bits_per_second": 2654456723,
    "bytes": 1194505525278,
    "timestamp": "2017-04-03T19:00:00.000Z"
  },
  {
    "bits_per_second": 2560567429,
    "bytes": 1152255343006,
    "timestamp": "2017-04-03T18:00:00.000Z"
  },
  {
    "bits_per_second": 2415566632,
    "bytes": 1087004984591,
    "timestamp": "2017-04-03T17:00:00.000Z"
  },
  {
    "bits_per_second": 2251121507,
    "bytes": 1013004678197,
    "timestamp": "2017-04-03T16:00:00.000Z"
  },
  {
    "bits_per_second": 2225010277,
    "bytes": 1001254624691,
    "timestamp": "2017-04-03T15:00:00.000Z"
  },
  {
    "bits_per_second": 2025009306,
    "bytes": 911254187542,
    "timestamp": "2017-04-03T14:00:00.000Z"
  },
  {
    "bits_per_second": 1564451649,
    "bytes": 704003242200,
    "timestamp": "2017-04-03T13:00:00.000Z"
  },
  {
    "bits_per_second": 1384450881,
    "bytes": 623002896287,
    "timestamp": "2017-04-03T12:00:00.000Z"
  },
  {
    "bits_per_second": 1280005801,
    "bytes": 576002610390,
    "timestamp": "2017-04-03T11:00:00.000Z"
  },
  {
    "bits_per_second": 1190561016,
    "bytes": 535752457224,
    "timestamp": "2017-04-03T10:00:00.000Z"
  },
  {
    "bits_per_second": 1624451907,
    "bytes": 731003358128,
    "timestamp": "2017-04-03T09:00:00.000Z"
  },
  {
    "bits_per_second": 1660007688,
    "bytes": 747003459530,
    "timestamp": "2017-04-03T08:00:00.000Z"
  },
  {
    "bits_per_second": 1740563683,
    "bytes": 783253657402,
    "timestamp": "2017-04-03T07:00:00.000Z"
  },
  {
    "bits_per_second": 1813897311,
    "bytes": 816253789819,
    "timestamp": "2017-04-03T06:00:00.000Z"
  },
  {
    "bits_per_second": 1449451204,
    "bytes": 652253041602,
    "timestamp": "2017-04-03T05:00:00.000Z"
  },
  {
    "bits_per_second": 1642229915,
    "bytes": 739003461661,
    "timestamp": "2017-04-03T04:00:00.000Z"
  },
  {
    "bits_per_second": 2054453908,
    "bytes": 924504258587,
    "timestamp": "2017-04-03T03:00:00.000Z"
  },
  {
    "bits_per_second": 2235010286,
    "bytes": 1005754628764,
    "timestamp": "2017-04-03T02:00:00.000Z"
  },
  {
    "bits_per_second": 2423344495,
    "bytes": 1090505022608,
    "timestamp": "2017-04-03T01:00:00.000Z"
  },
  {
    "bits_per_second": 2625012104,
    "bytes": 1181255446778,
    "timestamp": "2017-04-03T00:00:00.000Z"
  },
  {
    "bits_per_second": 3076680754,
    "bytes": 1384506339123,
    "timestamp": "2017-04-02T23:00:00.000Z"
  },
  {
    "bits_per_second": 3181125686,
    "bytes": 1431506558673,
    "timestamp": "2017-04-02T22:00:00.000Z"
  },
  {
    "bits_per_second": 2980569242,
    "bytes": 1341256158735,
    "timestamp": "2017-04-02T21:00:00.000Z"
  },
  {
    "bits_per_second": 3017236042,
    "bytes": 1357756218942,
    "timestamp": "2017-04-02T20:00:00.000Z"
  },
  {
    "bits_per_second": 3079458585,
    "bytes": 1385756363337,
    "timestamp": "2017-04-02T19:00:00.000Z"
  },
  {
    "bits_per_second": 2958346979,
    "bytes": 1331256140763,
    "timestamp": "2017-04-02T18:00:00.000Z"
  },
  {
    "bits_per_second": 2846679721,
    "bytes": 1281005874510,
    "timestamp": "2017-04-02T17:00:00.000Z"
  },
  {
    "bits_per_second": 2621678748,
    "bytes": 1179755436712,
    "timestamp": "2017-04-02T16:00:00.000Z"
  },
  {
    "bits_per_second": 2259454805,
    "bytes": 1016754662333,
    "timestamp": "2017-04-02T15:00:00.000Z"
  },
  {
    "bits_per_second": 2081120606,
    "bytes": 936504272706,
    "timestamp": "2017-04-02T14:00:00.000Z"
  },
  {
    "bits_per_second": 2093343053,
    "bytes": 942004373637,
    "timestamp": "2017-04-02T13:00:00.000Z"
  },
  {
    "bits_per_second": 1896675362,
    "bytes": 853503913103,
    "timestamp": "2017-04-02T12:00:00.000Z"
  },
  {
    "bits_per_second": 1509451405,
    "bytes": 679253132069,
    "timestamp": "2017-04-02T11:00:00.000Z"
  },
  {
    "bits_per_second": 1418895591,
    "bytes": 638503015848,
    "timestamp": "2017-04-02T10:00:00.000Z"
  },
  {
    "bits_per_second": 1623896361,
    "bytes": 730753362578,
    "timestamp": "2017-04-02T09:00:00.000Z"
  },
  {
    "bits_per_second": 1636674177,
    "bytes": 736503379726,
    "timestamp": "2017-04-02T08:00:00.000Z"
  },
  {
    "bits_per_second": 1428895573,
    "bytes": 643003008016,
    "timestamp": "2017-04-02T07:00:00.000Z"
  },
  {
    "bits_per_second": 1547784869,
    "bytes": 696503191263,
    "timestamp": "2017-04-02T06:00:00.000Z"
  },
  {
    "bits_per_second": 1917786557,
    "bytes": 863003950640,
    "timestamp": "2017-04-02T05:00:00.000Z"
  },
  {
    "bits_per_second": 2098898660,
    "bytes": 944504397181,
    "timestamp": "2017-04-02T04:00:00.000Z"
  },
  {
    "bits_per_second": 2445566821,
    "bytes": 1100505069477,
    "timestamp": "2017-04-02T03:00:00.000Z"
  },
  {
    "bits_per_second": 2621678749,
    "bytes": 1179755437020,
    "timestamp": "2017-04-02T02:00:00.000Z"
  },
  {
    "bits_per_second": 2666678921,
    "bytes": 1200005514570,
    "timestamp": "2017-04-02T01:00:00.000Z"
  },
  {
    "bits_per_second": 2805568591,
    "bytes": 1262505866040,
    "timestamp": "2017-04-02T00:00:00.000Z"
  },
  {
    "bits_per_second": 3199459117,
    "bytes": 1439756602704,
    "timestamp": "2017-04-01T23:00:00.000Z"
  },
  {
    "bits_per_second": 3266681658,
    "bytes": 1470006745906,
    "timestamp": "2017-04-01T22:00:00.000Z"
  },
  {
    "bits_per_second": 3161125637,
    "bytes": 1422506536846,
    "timestamp": "2017-04-01T21:00:00.000Z"
  },
  {
    "bits_per_second": 3136681127,
    "bytes": 1411506507121,
    "timestamp": "2017-04-01T20:00:00.000Z"
  },
  {
    "bits_per_second": 3260014986,
    "bytes": 1467006743483,
    "timestamp": "2017-04-01T19:00:00.000Z"
  },
  {
    "bits_per_second": 3171125804,
    "bytes": 1427006611620,
    "timestamp": "2017-04-01T18:00:00.000Z"
  },
  {
    "bits_per_second": 2937791429,
    "bytes": 1322006143125,
    "timestamp": "2017-04-01T17:00:00.000Z"
  },
  {
    "bits_per_second": 2773346178,
    "bytes": 1248005779960,
    "timestamp": "2017-04-01T16:00:00.000Z"
  },
  {
    "bits_per_second": 2551678531,
    "bytes": 1148255339030,
    "timestamp": "2017-04-01T15:00:00.000Z"
  },
  {
    "bits_per_second": 2400011125,
    "bytes": 1080005006425,
    "timestamp": "2017-04-01T14:00:00.000Z"
  },
  {
    "bits_per_second": 2381122029,
    "bytes": 1071504912955,
    "timestamp": "2017-04-01T13:00:00.000Z"
  },
  {
    "bits_per_second": 2225565839,
    "bytes": 1001504627512,
    "timestamp": "2017-04-01T12:00:00.000Z"
  },
  {
    "bits_per_second": 2127231836,
    "bytes": 957254325998,
    "timestamp": "2017-04-01T11:00:00.000Z"
  },
  {
    "bits_per_second": 2035009475,
    "bytes": 915754263630,
    "timestamp": "2017-04-01T10:00:00.000Z"
  },
  {
    "bits_per_second": 1482784584,
    "bytes": 667253062962,
    "timestamp": "2017-04-01T09:00:00.000Z"
  },
  {
    "bits_per_second": 1477784460,
    "bytes": 665003006832,
    "timestamp": "2017-04-01T08:00:00.000Z"
  },
  {
    "bits_per_second": 1587785026,
    "bytes": 714503261812,
    "timestamp": "2017-04-01T07:00:00.000Z"
  },
  {
    "bits_per_second": 1691118815,
    "bytes": 761003466572,
    "timestamp": "2017-04-01T06:00:00.000Z"
  },
  {
    "bits_per_second": 2208899058,
    "bytes": 994004576152,
    "timestamp": "2017-04-01T05:00:00.000Z"
  },
  {
    "bits_per_second": 2374455154,
    "bytes": 1068504819299,
    "timestamp": "2017-04-01T04:00:00.000Z"
  },
  {
    "bits_per_second": 2537789509,
    "bytes": 1142005279066,
    "timestamp": "2017-04-01T03:00:00.000Z"
  },
  {
    "bits_per_second": 2702234665,
    "bytes": 1216005599067,
    "timestamp": "2017-04-01T02:00:00.000Z"
  },
  {
    "bits_per_second": 2758346166,
    "bytes": 1241255774662,
    "timestamp": "2017-04-01T01:00:00.000Z"
  },
  {
    "bits_per_second": 2932791261,
    "bytes": 1319756067662,
    "timestamp": "2017-04-01T00:00:00.000Z"
  },
  {
    "bits_per_second": 3059458501,
    "bytes": 1376756325536,
    "timestamp": "2017-03-31T23:00:00.000Z"
  },
  {
    "bits_per_second": 3131125520,
    "bytes": 1409006483871,
    "timestamp": "2017-03-31T22:00:00.000Z"
  },
  {
    "bits_per_second": 3198903655,
    "bytes": 1439506644609,
    "timestamp": "2017-03-31T21:00:00.000Z"
  },
  {
    "bits_per_second": 3213903861,
    "bytes": 1446256737587,
    "timestamp": "2017-03-31T20:00:00.000Z"
  },
  {
    "bits_per_second": 3220570357,
    "bytes": 1449256660757,
    "timestamp": "2017-03-31T19:00:00.000Z"
  },
  {
    "bits_per_second": 3131680977,
    "bytes": 1409256439605,
    "timestamp": "2017-03-31T18:00:00.000Z"
  },
  {
    "bits_per_second": 3122236546,
    "bytes": 1405006445647,
    "timestamp": "2017-03-31T17:00:00.000Z"
  },
  {
    "bits_per_second": 2920568964,
    "bytes": 1314256033876,
    "timestamp": "2017-03-31T16:00:00.000Z"
  },
  {
    "bits_per_second": 2782235069,
    "bytes": 1252005780970,
    "timestamp": "2017-03-31T15:00:00.000Z"
  },
  {
    "bits_per_second": 2597789730,
    "bytes": 1169005378372,
    "timestamp": "2017-03-31T14:00:00.000Z"
  },
  {
    "bits_per_second": 2250566048,
    "bytes": 1012754721409,
    "timestamp": "2017-03-31T13:00:00.000Z"
  },
  {
    "bits_per_second": 2080009636,
    "bytes": 936004336145,
    "timestamp": "2017-03-31T12:00:00.000Z"
  },
  {
    "bits_per_second": 1942231086,
    "bytes": 874003988677,
    "timestamp": "2017-03-31T11:00:00.000Z"
  },
  {
    "bits_per_second": 1827230649,
    "bytes": 822253791923,
    "timestamp": "2017-03-31T10:00:00.000Z"
  },
  {
    "bits_per_second": 1599451727,
    "bytes": 719753277014,
    "timestamp": "2017-03-31T09:00:00.000Z"
  },
  {
    "bits_per_second": 1614451822,
    "bytes": 726503320050,
    "timestamp": "2017-03-31T08:00:00.000Z"
  },
  {
    "bits_per_second": 2071120474,
    "bytes": 932004213081,
    "timestamp": "2017-03-31T07:00:00.000Z"
  },
  {
    "bits_per_second": 2172232213,
    "bytes": 977504495910,
    "timestamp": "2017-03-31T06:00:00.000Z"
  },
  {
    "bits_per_second": 1890008728,
    "bytes": 850503927422,
    "timestamp": "2017-03-31T05:00:00.000Z"
  },
  {
    "bits_per_second": 2083898465,
    "bytes": 937754309270,
    "timestamp": "2017-03-31T04:00:00.000Z"
  },
  {
    "bits_per_second": 2575011914,
    "bytes": 1158755361395,
    "timestamp": "2017-03-31T03:00:00.000Z"
  },
  {
    "bits_per_second": 2757790417,
    "bytes": 1241005687782,
    "timestamp": "2017-03-31T02:00:00.000Z"
  },
  {
    "bits_per_second": 2818901878,
    "bytes": 1268505845310,
    "timestamp": "2017-03-31T01:00:00.000Z"
  },
  {
    "bits_per_second": 3005569429,
    "bytes": 1352506243152,
    "timestamp": "2017-03-31T00:00:00.000Z"
  },
  {
    "bits_per_second": 3127236536,
    "bytes": 1407256441014,
    "timestamp": "2017-03-30T23:00:00.000Z"
  },
  {
    "bits_per_second": 3196681414,
    "bytes": 1438506636180,
    "timestamp": "2017-03-30T22:00:00.000Z"
  },
  {
    "bits_per_second": 3348904333,
    "bytes": 1507006949860,
    "timestamp": "2017-03-30T21:00:00.000Z"
  },
  {
    "bits_per_second": 3347793202,
    "bytes": 1506506940892,
    "timestamp": "2017-03-30T20:00:00.000Z"
  },
  {
    "bits_per_second": 3188903689,
    "bytes": 1435006660265,
    "timestamp": "2017-03-30T19:00:00.000Z"
  },
  {
    "bits_per_second": 3067791909,
    "bytes": 1380506359077,
    "timestamp": "2017-03-30T18:00:00.000Z"
  },
  {
    "bits_per_second": 3010013897,
    "bytes": 1354506253745,
    "timestamp": "2017-03-30T17:00:00.000Z"
  },
  {
    "bits_per_second": 2872235407,
    "bytes": 1292505933082,
    "timestamp": "2017-03-30T16:00:00.000Z"
  },
  {
    "bits_per_second": 2475011445,
    "bytes": 1113755150460,
    "timestamp": "2017-03-30T15:00:00.000Z"
  },
  {
    "bits_per_second": 2317233056,
    "bytes": 1042754875370,
    "timestamp": "2017-03-30T14:00:00.000Z"
  },
  {
    "bits_per_second": 2110565304,
    "bytes": 949754386923,
    "timestamp": "2017-03-30T13:00:00.000Z"
  },
  {
    "bits_per_second": 1937786633,
    "bytes": 872003984863,
    "timestamp": "2017-03-30T12:00:00.000Z"
  },
  {
    "bits_per_second": 1976675761,
    "bytes": 889504092315,
    "timestamp": "2017-03-30T11:00:00.000Z"
  },
  {
    "bits_per_second": 1880008504,
    "bytes": 846003826587,
    "timestamp": "2017-03-30T10:00:00.000Z"
  },
  {
    "bits_per_second": 2093343062,
    "bytes": 942004377999,
    "timestamp": "2017-03-30T09:00:00.000Z"
  },
  {
    "bits_per_second": 2102787421,
    "bytes": 946254339610,
    "timestamp": "2017-03-30T08:00:00.000Z"
  },
  {
    "bits_per_second": 1680007790,
    "bytes": 756003505440,
    "timestamp": "2017-03-30T07:00:00.000Z"
  },
  {
    "bits_per_second": 1806119309,
    "bytes": 812753689006,
    "timestamp": "2017-03-30T06:00:00.000Z"
  },
  {
    "bits_per_second": 1941675708,
    "bytes": 873754068630,
    "timestamp": "2017-03-30T05:00:00.000Z"
  },
  {
    "bits_per_second": 2107787496,
    "bytes": 948504373116,
    "timestamp": "2017-03-30T04:00:00.000Z"
  },
  {
    "bits_per_second": 2384455453,
    "bytes": 1073004953635,
    "timestamp": "2017-03-30T03:00:00.000Z"
  },
  {
    "bits_per_second": 2527789331,
    "bytes": 1137505199046,
    "timestamp": "2017-03-30T02:00:00.000Z"
  },
  {
    "bits_per_second": 2905568979,
    "bytes": 1307506040601,
    "timestamp": "2017-03-30T01:00:00.000Z"
  },
  {
    "bits_per_second": 3075569738,
    "bytes": 1384006382261,
    "timestamp": "2017-03-30T00:00:00.000Z"
  },
  {
    "bits_per_second": 3145569955,
    "bytes": 1415506479878,
    "timestamp": "2017-03-29T23:00:00.000Z"
  },
  {
    "bits_per_second": 3271681796,
    "bytes": 1472256808146,
    "timestamp": "2017-03-29T22:00:00.000Z"
  },
  {
    "bits_per_second": 3315570927,
    "bytes": 1492006916951,
    "timestamp": "2017-03-29T21:00:00.000Z"
  },
  {
    "bits_per_second": 3332237432,
    "bytes": 1499506844229,
    "timestamp": "2017-03-29T20:00:00.000Z"
  },
  {
    "bits_per_second": 3397793386,
    "bytes": 1529007023657,
    "timestamp": "2017-03-29T19:00:00.000Z"
  },
  {
    "bits_per_second": 3286126281,
    "bytes": 1478756826447,
    "timestamp": "2017-03-29T18:00:00.000Z"
  },
  {
    "bits_per_second": 3078347356,
    "bytes": 1385256310111,
    "timestamp": "2017-03-29T17:00:00.000Z"
  },
  {
    "bits_per_second": 2875013263,
    "bytes": 1293755968473,
    "timestamp": "2017-03-29T16:00:00.000Z"
  },
  {
    "bits_per_second": 2712234738,
    "bytes": 1220505632221,
    "timestamp": "2017-03-29T15:00:00.000Z"
  },
  {
    "bits_per_second": 2533900528,
    "bytes": 1140255237606,
    "timestamp": "2017-03-29T14:00:00.000Z"
  },
  {
    "bits_per_second": 2313343990,
    "bytes": 1041004795367,
    "timestamp": "2017-03-29T13:00:00.000Z"
  },
  {
    "bits_per_second": 2157787624,
    "bytes": 971004430906,
    "timestamp": "2017-03-29T12:00:00.000Z"
  },
  {
    "bits_per_second": 1781674855,
    "bytes": 801753684529,
    "timestamp": "2017-03-29T11:00:00.000Z"
  },
  {
    "bits_per_second": 1672229965,
    "bytes": 752503484406,
    "timestamp": "2017-03-29T10:00:00.000Z"
  },
  {
    "bits_per_second": 1620007479,
    "bytes": 729003365335,
    "timestamp": "2017-03-29T09:00:00.000Z"
  },
  {
    "bits_per_second": 1623340837,
    "bytes": 730503376804,
    "timestamp": "2017-03-29T08:00:00.000Z"
  },
  {
    "bits_per_second": 1713341243,
    "bytes": 771003559296,
    "timestamp": "2017-03-29T07:00:00.000Z"
  },
  {
    "bits_per_second": 1841119532,
    "bytes": 828503789437,
    "timestamp": "2017-03-29T06:00:00.000Z"
  },
  {
    "bits_per_second": 2319455086,
    "bytes": 1043754788889,
    "timestamp": "2017-03-29T05:00:00.000Z"
  },
  {
    "bits_per_second": 2497233687,
    "bytes": 1123755158958,
    "timestamp": "2017-03-29T04:00:00.000Z"
  },
  {
    "bits_per_second": 2691123449,
    "bytes": 1211005552216,
    "timestamp": "2017-03-29T03:00:00.000Z"
  },
  {
    "bits_per_second": 2832790807,
    "bytes": 1274755862986,
    "timestamp": "2017-03-29T02:00:00.000Z"
  },
  {
    "bits_per_second": 2936124725,
    "bytes": 1321256126361,
    "timestamp": "2017-03-29T01:00:00.000Z"
  },
  {
    "bits_per_second": 3101125480,
    "bytes": 1395506465972,
    "timestamp": "2017-03-29T00:00:00.000Z"
  },
  {
    "bits_per_second": 3197792633,
    "bytes": 1439006684949,
    "timestamp": "2017-03-28T23:00:00.000Z"
  },
  {
    "bits_per_second": 3279459650,
    "bytes": 1475756842404,
    "timestamp": "2017-03-28T22:00:00.000Z"
  },
  {
    "bits_per_second": 3216681555,
    "bytes": 1447506699632,
    "timestamp": "2017-03-28T21:00:00.000Z"
  },
  {
    "bits_per_second": 3271681645,
    "bytes": 1472256740332,
    "timestamp": "2017-03-28T20:00:00.000Z"
  },
  {
    "bits_per_second": 3292237248,
    "bytes": 1481506761517,
    "timestamp": "2017-03-28T19:00:00.000Z"
  },
  {
    "bits_per_second": 3199459236,
    "bytes": 1439756656075,
    "timestamp": "2017-03-28T18:00:00.000Z"
  },
  {
    "bits_per_second": 2947235858,
    "bytes": 1326256136002,
    "timestamp": "2017-03-28T17:00:00.000Z"
  },
  {
    "bits_per_second": 2789457340,
    "bytes": 1255255803143,
    "timestamp": "2017-03-28T16:00:00.000Z"
  },
  {
    "bits_per_second": 2775012790,
    "bytes": 1248755755411,
    "timestamp": "2017-03-28T15:00:00.000Z"
  },
  {
    "bits_per_second": 2570011719,
    "bytes": 1156505273595,
    "timestamp": "2017-03-28T14:00:00.000Z"
  },
  {
    "bits_per_second": 2196121328,
    "bytes": 988254597753,
    "timestamp": "2017-03-28T13:00:00.000Z"
  },
  {
    "bits_per_second": 2062787358,
    "bytes": 928254311284,
    "timestamp": "2017-03-28T12:00:00.000Z"
  },
  {
    "bits_per_second": 2113343033,
    "bytes": 951004364696,
    "timestamp": "2017-03-28T11:00:00.000Z"
  },
  {
    "bits_per_second": 1999453582,
    "bytes": 899754111842,
    "timestamp": "2017-03-28T10:00:00.000Z"
  },
  {
    "bits_per_second": 1999453672,
    "bytes": 899754152435,
    "timestamp": "2017-03-28T09:00:00.000Z"
  },
  {
    "bits_per_second": 1983897994,
    "bytes": 892754097173,
    "timestamp": "2017-03-28T08:00:00.000Z"
  },
  {
    "bits_per_second": 1816674935,
    "bytes": 817503720706,
    "timestamp": "2017-03-28T07:00:00.000Z"
  },
  {
    "bits_per_second": 1907786523,
    "bytes": 858503935561,
    "timestamp": "2017-03-28T06:00:00.000Z"
  },
  {
    "bits_per_second": 1862230838,
    "bytes": 838003877117,
    "timestamp": "2017-03-28T05:00:00.000Z"
  },
  {
    "bits_per_second": 2022231537,
    "bytes": 910004191834,
    "timestamp": "2017-03-28T04:00:00.000Z"
  },
  {
    "bits_per_second": 2293344012,
    "bytes": 1032004805614,
    "timestamp": "2017-03-28T03:00:00.000Z"
  },
  {
    "bits_per_second": 2470011362,
    "bytes": 1111505112938,
    "timestamp": "2017-03-28T02:00:00.000Z"
  },
  {
    "bits_per_second": 2789457166,
    "bytes": 1255255724566,
    "timestamp": "2017-03-28T01:00:00.000Z"
  },
  {
    "bits_per_second": 2983347134,
    "bytes": 1342506210251,
    "timestamp": "2017-03-28T00:00:00.000Z"
  },
  {
    "bits_per_second": 3071680881,
    "bytes": 1382256396640,
    "timestamp": "2017-03-27T23:00:00.000Z"
  },
  {
    "bits_per_second": 3182236783,
    "bytes": 1432006552456,
    "timestamp": "2017-03-27T22:00:00.000Z"
  },
  {
    "bits_per_second": 3304459667,
    "bytes": 1487006850040,
    "timestamp": "2017-03-27T21:00:00.000Z"
  },
  {
    "bits_per_second": 3328904153,
    "bytes": 1498006869027,
    "timestamp": "2017-03-27T20:00:00.000Z"
  },
  {
    "bits_per_second": 1289450409,
    "bytes": 580252683944,
    "timestamp": "2017-03-27T19:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T18:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T17:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T16:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T15:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T14:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T13:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T12:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T11:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T10:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T09:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T08:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T07:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T06:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T05:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T04:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T03:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T02:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T01:00:00.000Z"
  },
  {
    "bits_per_second": null,
    "bytes": null,
    "timestamp": "2017-03-27T00:00:00.000Z"
  },
  {
    "bits_per_second": 2870013243,
    "bytes": 1291505959295,
    "timestamp": "2017-03-26T23:00:00.000Z"
  },
  {
    "bits_per_second": 3015013913,
    "bytes": 1356756260976,
    "timestamp": "2017-03-26T22:00:00.000Z"
  },
  {
    "bits_per_second": 2932235720,
    "bytes": 1319506073999,
    "timestamp": "2017-03-26T21:00:00.000Z"
  },
  {
    "bits_per_second": 2906124465,
    "bytes": 1307756009436,
    "timestamp": "2017-03-26T20:00:00.000Z"
  },
  {
    "bits_per_second": 3071125252,
    "bytes": 1382006363312,
    "timestamp": "2017-03-26T19:00:00.000Z"
  },
  {
    "bits_per_second": 3003902776,
    "bytes": 1351756249047,
    "timestamp": "2017-03-26T18:00:00.000Z"
  },
  {
    "bits_per_second": 2881124366,
    "bytes": 1296505964898,
    "timestamp": "2017-03-26T17:00:00.000Z"
  },
  {
    "bits_per_second": 2698901486,
    "bytes": 1214505668766,
    "timestamp": "2017-03-26T16:00:00.000Z"
  },
  {
    "bits_per_second": 2545011645,
    "bytes": 1145255240265,
    "timestamp": "2017-03-26T15:00:00.000Z"
  },
  {
    "bits_per_second": 2353344164,
    "bytes": 1059004873852,
    "timestamp": "2017-03-26T14:00:00.000Z"
  },
  {
    "bits_per_second": 2200010226,
    "bytes": 990004601494,
    "timestamp": "2017-03-26T13:00:00.000Z"
  },
  {
    "bits_per_second": 2023342670,
    "bytes": 910504201637,
    "timestamp": "2017-03-26T12:00:00.000Z"
  },
  {
    "bits_per_second": 1973897980,
    "bytes": 888254091150,
    "timestamp": "2017-03-26T11:00:00.000Z"
  },
  {
    "bits_per_second": 1833341851,
    "bytes": 825003832900,
    "timestamp": "2017-03-26T10:00:00.000Z"
  },
  {
    "bits_per_second": 1302783720,
    "bytes": 586252674144,
    "timestamp": "2017-03-26T09:00:00.000Z"
  },
  {
    "bits_per_second": 1321672777,
    "bytes": 594752749663,
    "timestamp": "2017-03-26T08:00:00.000Z"
  },
  {
    "bits_per_second": 1801119371,
    "bytes": 810503716790,
    "timestamp": "2017-03-26T07:00:00.000Z"
  },
  {
    "bits_per_second": 1912231005,
    "bytes": 860503952124,
    "timestamp": "2017-03-26T06:00:00.000Z"
  },
  {
    "bits_per_second": 2043342654,
    "bytes": 919504194421,
    "timestamp": "2017-03-26T05:00:00.000Z"
  },
  {
    "bits_per_second": 2201676770,
    "bytes": 990754546533,
    "timestamp": "2017-03-26T04:00:00.000Z"
  },
  {
    "bits_per_second": 2190010128,
    "bytes": 985504557433,
    "timestamp": "2017-03-26T03:00:00.000Z"
  },
  {
    "bits_per_second": 2388344440,
    "bytes": 1074754998037,
    "timestamp": "2017-03-26T02:00:00.000Z"
  },
  {
    "bits_per_second": 2583345170,
    "bytes": 1162505326663,
    "timestamp": "2017-03-26T01:00:00.000Z"
  },
  {
    "bits_per_second": 2758346052,
    "bytes": 1241255723342,
    "timestamp": "2017-03-26T00:00:00.000Z"
  },
  {
    "bits_per_second": 2914457873,
    "bytes": 1311506042686,
    "timestamp": "2017-03-25T23:00:00.000Z"
  },
  {
    "bits_per_second": 2997235843,
    "bytes": 1348756129195,
    "timestamp": "2017-03-25T22:00:00.000Z"
  },
  {
    "bits_per_second": 2948346944,
    "bytes": 1326756124906,
    "timestamp": "2017-03-25T21:00:00.000Z"
  },
  {
    "bits_per_second": 2974458132,
    "bytes": 1338506159391,
    "timestamp": "2017-03-25T20:00:00.000Z"
  },
  {
    "bits_per_second": 3151125730,
    "bytes": 1418006578706,
    "timestamp": "2017-03-25T19:00:00.000Z"
  },
  {
    "bits_per_second": 3034458480,
    "bytes": 1365506315791,
    "timestamp": "2017-03-25T18:00:00.000Z"
  },
  {
    "bits_per_second": 2580011817,
    "bytes": 1161005317558,
    "timestamp": "2017-03-25T17:00:00.000Z"
  },
  {
    "bits_per_second": 2400566587,
    "bytes": 1080254964127,
    "timestamp": "2017-03-25T16:00:00.000Z"
  },
  {
    "bits_per_second": 2180565606,
    "bytes": 981254522796,
    "timestamp": "2017-03-25T15:00:00.000Z"
  },
  {
    "bits_per_second": 1987786912,
    "bytes": 894504110296,
    "timestamp": "2017-03-25T14:00:00.000Z"
  },
  {
    "bits_per_second": 1783897112,
    "bytes": 802753700485,
    "timestamp": "2017-03-25T13:00:00.000Z"
  },
  {
    "bits_per_second": 1616118528,
    "bytes": 727253337477,
    "timestamp": "2017-03-25T12:00:00.000Z"
  },
  {
    "bits_per_second": 1725007923,
    "bytes": 776253565369,
    "timestamp": "2017-03-25T11:00:00.000Z"
  },
  {
    "bits_per_second": 1601674111,
    "bytes": 720753349738,
    "timestamp": "2017-03-25T10:00:00.000Z"
  },
  {
    "bits_per_second": 1331117253,
    "bytes": 599002763658,
    "timestamp": "2017-03-25T09:00:00.000Z"
  },
  {
    "bits_per_second": 1347783931,
    "bytes": 606502769008,
    "timestamp": "2017-03-25T08:00:00.000Z"
  },
  {
    "bits_per_second": 1852230724,
    "bytes": 833503825757,
    "timestamp": "2017-03-25T07:00:00.000Z"
  },
  {
    "bits_per_second": 1935564461,
    "bytes": 871004007511,
    "timestamp": "2017-03-25T06:00:00.000Z"
  },
  {
    "bits_per_second": 1864453015,
    "bytes": 839003856665,
    "timestamp": "2017-03-25T05:00:00.000Z"
  },
  {
    "bits_per_second": 2024453720,
    "bytes": 911004174015,
    "timestamp": "2017-03-25T04:00:00.000Z"
  },
  {
    "bits_per_second": 2228343509,
    "bytes": 1002754578942,
    "timestamp": "2017-03-25T03:00:00.000Z"
  },
  {
    "bits_per_second": 2413900039,
    "bytes": 1086255017532,
    "timestamp": "2017-03-25T02:00:00.000Z"
  },
  {
    "bits_per_second": 2600567590,
    "bytes": 1170255415365,
    "timestamp": "2017-03-25T01:00:00.000Z"
  },
  {
    "bits_per_second": 2785012818,
    "bytes": 1253255768277,
    "timestamp": "2017-03-25T00:00:00.000Z"
  }
])

export const starburstTrafficData = Immutable.fromJS([
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1495152000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1495065600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494979200
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494892800
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494806400
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494720000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494633600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494547200
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "transfer_rates": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null
    },
    "requests": {
      "total": null,
      "peak": null,
      "low": null,
      "average": null
    },
    "connections": {
      "total": 0,
      "peak": null,
      "low": null,
      "average": null,
      "per_second": 0
    },
    "timestamp": 1494460800
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 31192494766769,
      "peak": 1754050779632,
      "low": 800296898228,
      "average": 1299687281949
    },
    "transfer_rates": {
      "total": 69316655037,
      "peak": 3897890621,
      "low": 1778437552,
      "average": 2888193960
    },
    "requests": {
      "total": 120943,
      "peak": 6801,
      "low": 3103,
      "average": 5039
    },
    "connections": {
      "total": 120943,
      "peak": 6801,
      "low": 3103,
      "average": 5039,
      "per_second": 1.4
    },
    "timestamp": 1494374400
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 29250942800911,
      "peak": 1643407034435,
      "low": 725244911959,
      "average": 1218789283371
    },
    "transfer_rates": {
      "total": 65002095113,
      "peak": 3652015632,
      "low": 1611655360,
      "average": 2708420630
    },
    "requests": {
      "total": 113415,
      "peak": 6372,
      "low": 2812,
      "average": 4726
    },
    "connections": {
      "total": 113415,
      "peak": 6372,
      "low": 2812,
      "average": 4726,
      "per_second": 1.31
    },
    "timestamp": 1494288000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 29241916427945,
      "peak": 1621226677764,
      "low": 711833603220,
      "average": 1218413184498
    },
    "transfer_rates": {
      "total": 64982036507,
      "peak": 3602725951,
      "low": 1581852452,
      "average": 2707584854
    },
    "requests": {
      "total": 113380,
      "peak": 6286,
      "low": 2760,
      "average": 4724
    },
    "connections": {
      "total": 113380,
      "peak": 6286,
      "low": 2760,
      "average": 4724,
      "per_second": 1.31
    },
    "timestamp": 1494201600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 24324590283314,
      "peak": 1535342440242,
      "low": 516853030478,
      "average": 1013524595138
    },
    "transfer_rates": {
      "total": 54054645074,
      "peak": 3411872089,
      "low": 1148562290,
      "average": 2252276878
    },
    "requests": {
      "total": 94314,
      "peak": 5953,
      "low": 2004,
      "average": 3930
    },
    "connections": {
      "total": 94314,
      "peak": 5953,
      "low": 2004,
      "average": 3930,
      "per_second": 1.09
    },
    "timestamp": 1494115200
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 27024915576396,
      "peak": 1571449932235,
      "low": 623885986701,
      "average": 1126038149017
    },
    "transfer_rates": {
      "total": 60055367948,
      "peak": 3492110961,
      "low": 1386413304,
      "average": 2502306998
    },
    "requests": {
      "total": 104784,
      "peak": 6093,
      "low": 2419,
      "average": 4366
    },
    "connections": {
      "total": 104784,
      "peak": 6093,
      "low": 2419,
      "average": 4366,
      "per_second": 1.21
    },
    "timestamp": 1494028800
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 27060765072851,
      "peak": 1565260106966,
      "low": 681400085655,
      "average": 1127531878035
    },
    "transfer_rates": {
      "total": 60135033495,
      "peak": 3478355793,
      "low": 1514222413,
      "average": 2505626396
    },
    "requests": {
      "total": 104923,
      "peak": 6069,
      "low": 2642,
      "average": 4372
    },
    "connections": {
      "total": 104923,
      "peak": 6069,
      "low": 2642,
      "average": 4372,
      "per_second": 1.21
    },
    "timestamp": 1493942400
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 29262290946133,
      "peak": 1654239281620,
      "low": 815255687784,
      "average": 1219262122756
    },
    "transfer_rates": {
      "total": 65027313214,
      "peak": 3676087292,
      "low": 1811679306,
      "average": 2709471384
    },
    "requests": {
      "total": 113459,
      "peak": 6414,
      "low": 3161,
      "average": 4727
    },
    "connections": {
      "total": 113459,
      "peak": 6414,
      "low": 3161,
      "average": 4727,
      "per_second": 1.31
    },
    "timestamp": 1493856000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 29534902747458,
      "peak": 1673066722886,
      "low": 698680126572,
      "average": 1230620947811
    },
    "transfer_rates": {
      "total": 65633117217,
      "peak": 3717926051,
      "low": 1552622503,
      "average": 2734713217
    },
    "requests": {
      "total": 114516,
      "peak": 6487,
      "low": 2709,
      "average": 4772
    },
    "connections": {
      "total": 114516,
      "peak": 6487,
      "low": 2709,
      "average": 4772,
      "per_second": 1.33
    },
    "timestamp": 1493769600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 29416521618376,
      "peak": 1637990891457,
      "low": 710028223717,
      "average": 1225688400766
    },
    "transfer_rates": {
      "total": 65370048041,
      "peak": 3639979759,
      "low": 1577840497,
      "average": 2723752002
    },
    "requests": {
      "total": 114057,
      "peak": 6351,
      "low": 2753,
      "average": 4752
    },
    "connections": {
      "total": 114057,
      "peak": 6351,
      "low": 2753,
      "average": 4752,
      "per_second": 1.32
    },
    "timestamp": 1493683200
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 27855388079570,
      "peak": 1568355040713,
      "low": 662314705484,
      "average": 1160641169982
    },
    "transfer_rates": {
      "total": 61900862399,
      "peak": 3485233424,
      "low": 1471810457,
      "average": 2579202600
    },
    "requests": {
      "total": 108004,
      "peak": 6081,
      "low": 2568,
      "average": 4500
    },
    "connections": {
      "total": 108004,
      "peak": 6081,
      "low": 2568,
      "average": 4500,
      "per_second": 1.25
    },
    "timestamp": 1493596800
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 28615708778797,
      "peak": 1663782035344,
      "low": 750520182896,
      "average": 1192321199117
    },
    "transfer_rates": {
      "total": 63590463953,
      "peak": 3697293412,
      "low": 1667822629,
      "average": 2649602665
    },
    "requests": {
      "total": 110952,
      "peak": 6451,
      "low": 2910,
      "average": 4623
    },
    "connections": {
      "total": 110952,
      "peak": 6451,
      "low": 2910,
      "average": 4623,
      "per_second": 1.28
    },
    "timestamp": 1493510400
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 31348272721864,
      "peak": 1745539678538,
      "low": 806228851150,
      "average": 1306178030078
    },
    "transfer_rates": {
      "total": 69662828271,
      "peak": 3878977063,
      "low": 1791619669,
      "average": 2902617845
    },
    "requests": {
      "total": 121547,
      "peak": 6768,
      "low": 3126,
      "average": 5064
    },
    "connections": {
      "total": 121547,
      "peak": 6768,
      "low": 3126,
      "average": 5064,
      "per_second": 1.41
    },
    "timestamp": 1493424000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 32144443448252,
      "peak": 1750439982238,
      "low": 1038606428786,
      "average": 1339351810344
    },
    "transfer_rates": {
      "total": 71432096552,
      "peak": 3889866627,
      "low": 2308014286,
      "average": 2976337356
    },
    "requests": {
      "total": 124634,
      "peak": 6787,
      "low": 4027,
      "average": 5193
    },
    "connections": {
      "total": 124634,
      "peak": 6787,
      "low": 4027,
      "average": 5193,
      "per_second": 1.44
    },
    "timestamp": 1493337600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 32971046934741,
      "peak": 1790416100573,
      "low": 914551304933,
      "average": 1373793622281
    },
    "transfer_rates": {
      "total": 73268993188,
      "peak": 3978702446,
      "low": 2032336233,
      "average": 3052874716
    },
    "requests": {
      "total": 127839,
      "peak": 6942,
      "low": 3546,
      "average": 5327
    },
    "connections": {
      "total": 127839,
      "peak": 6942,
      "low": 3546,
      "average": 5327,
      "per_second": 1.48
    },
    "timestamp": 1493251200
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 32535951538636,
      "peak": 1783968302665,
      "low": 859616386092,
      "average": 1355664647443
    },
    "transfer_rates": {
      "total": 72302114530,
      "peak": 3964374006,
      "low": 1910258636,
      "average": 3012588105
    },
    "requests": {
      "total": 126152,
      "peak": 6917,
      "low": 3333,
      "average": 5256
    },
    "connections": {
      "total": 126152,
      "peak": 6917,
      "low": 3333,
      "average": 5256,
      "per_second": 1.46
    },
    "timestamp": 1493164800
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 31661376161105,
      "peak": 1763593371884,
      "low": 834083226866,
      "average": 1319224006713
    },
    "transfer_rates": {
      "total": 70358613691,
      "peak": 3919096382,
      "low": 1853518282,
      "average": 2931608904
    },
    "requests": {
      "total": 122761,
      "peak": 6838,
      "low": 3234,
      "average": 5115
    },
    "connections": {
      "total": 122761,
      "peak": 6838,
      "low": 3234,
      "average": 5115,
      "per_second": 1.42
    },
    "timestamp": 1493078400
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 26673623058949,
      "peak": 1479006848174,
      "low": 697253210095,
      "average": 1111400960790
    },
    "transfer_rates": {
      "total": 59274717909,
      "peak": 3286681885,
      "low": 1549451578,
      "average": 2469779913
    },
    "requests": {
      "total": 106694,
      "peak": 5916,
      "low": 2789,
      "average": 4446
    },
    "connections": {
      "total": 106694,
      "peak": 5916,
      "low": 2789,
      "average": 4446,
      "per_second": 1.23
    },
    "timestamp": 1492992000
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 24542613068461,
      "peak": 1403756443318,
      "low": 590252708524,
      "average": 1022608877853
    },
    "transfer_rates": {
      "total": 54539140152,
      "peak": 3119458763,
      "low": 1311672686,
      "average": 2272464173
    },
    "requests": {
      "total": 98170,
      "peak": 5615,
      "low": 2361,
      "average": 4090
    },
    "connections": {
      "total": 98170,
      "peak": 5615,
      "low": 2361,
      "average": 4090,
      "per_second": 1.14
    },
    "timestamp": 1492905600
  },
  {
    "chit_ratio": null,
    "avg_fbl": null,
    "bytes": {
      "total": 24203361751576,
      "peak": 1397006462509,
      "low": 575002676062,
      "average": 1008473406316
    },
    "transfer_rates": {
      "total": 53785248337,
      "peak": 3104458806,
      "low": 1277783725,
      "average": 2241052014
    },
    "requests": {
      "total": 96813,
      "peak": 5588,
      "low": 2300,
      "average": 4034
    },
    "connections": {
      "total": 96813,
      "peak": 5588,
      "low": 2300,
      "average": 4034,
      "per_second": 1.12
    },
    "timestamp": 1492819200
  }
])

export const starburstDifferenceData = Immutable.fromJS([
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
])
