module.exports = function testData(options) {
  const TODAY = parseInt(options.start);
  return {
    "traffic": {
      bytes: 160000000000000,
      bytes_net_on: 57600000000000,
      bytes_net_off: 102400000000000,
      detail: [{
        timestamp: TODAY,
        bytes: 160000000000000,
        bytes_net_on: 57600000000000,
        bytes_net_off: 102400000000000
      }]
    },
    "bandwidth": {
      bits_per_second: 14814814815,
      detail: [{
        timestamp: TODAY,
        bits_per_second: 14814814815
      }]
    },
    "latency": {
      avg_fbl: "30 ms",
      detail: [{
        timestamp: TODAY,
        avg_fbl: 30
      }]
    },
    "connections": {
      connections_per_second: 10000,
      detail: [{
        timestamp: TODAY,
        connections_per_second: 10000
      }]
    },
    "cache_hit": {
      chit_ratio: 97,
      detail: [{
        timestamp: TODAY,
        chit_ratio: 97
      }]
    },
    "countries": [{
      code: "HKG",
      name: "Hong Kong",
      bytes: 2133287826954694,
      bits_per_second: 7597182253
    }],
    "providers": {
      bytes: 160000000000000,
      bits_per_second: 14814814815,
      detail: [{
        account: 1234,
        detail: [{
          timestamp: TODAY,
          bytes: 80000000000000,
          bits_per_second: 7407407408
        }]
      }, {
        account: 5678,
        detail: [{
          timestamp: TODAY,
          bytes: 80000000000000,
          bits_per_second: 7407407407
        }]
      }]
    }
  }
}
