'use strict';

module.exports = [{
  "name": "Vodafone",
  "http": {
    "net_on": 25000,
    "net_on_bps": 25000,
    "net_off": 50000,
    "net_off_bps": 50000
  },
  "https": {
    "net_on": 25000,
    "net_on_bps": 25000,
    "net_off": 50000,
    "net_off_bps": 50000
  },
  "countries": [{
    "name": "Germany",
    "code": "GER",
    "bytes": 150000,
    "bits_per_second": 150000,
    "percent_total": 0.35
  }, {
    "name": "France",
    "code": "FRA",
    "bytes": 150000,
    "bits_per_second": 150000,
    "percent_total": 0.20
  }]
}, {
  "name": "Telstra",
  "http": {
    "net_on": 50000,
    "net_on_bps": 50000,
    "net_off": 25000,
    "net_off_bps": 25000
  },
  "https": {
    "net_on": 25000,
    "net_on_bps": 25000,
    "net_off": 50000,
    "net_off_bps": 50000
  },
  "countries": [{
    "name": "Australia",
    "code": "AUS",
    "bytes": 150000,
    "bits_per_second": 150000,
    "percent_total": 0.30
  }]
}];
