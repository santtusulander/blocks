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
