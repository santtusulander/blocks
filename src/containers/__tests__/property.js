import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.mock('../../util/helpers', () => {
  return {
    formatBitsPerSecond: jest.fn(),
    getAnalyticsUrl: jest.fn(),
    removeProps: jest.fn(),
    matchesRegexp: jest.fn()
  }
})

jest.mock('../../util/routes', () => ({ getContentUrl: jest.fn() }))

jest.autoMockOff()

jest.unmock('../property.jsx')
import { Property } from '../property.jsx'

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn()
  }
}

function groupActionsMaker() {
  return {
    fetchGroup: jest.fn()
  }
}

function hostActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchHost: jest.fn(),
    fetchHosts: jest.fn()
  }
}

function metricsActionsMaker() {
  return {
    fetchDailyHostTraffic: jest.fn(),
    fetchHostMetrics: jest.fn(),
    fetchHourlyHostTraffic: jest.fn()
  }
}

function purgeActionsMaker() {
  return {
    resetActivePurge: jest.fn()
  }
}

function trafficActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchByTime: jest.fn(),
    finishFetching: jest.fn()
  }
}

function uiActionsMaker() {
  return {
    changeNotification: jest.fn()
  }
}

function visitorsActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchByCountry: jest.fn(),
    finishFetching: jest.fn(),
    visitorsReset: jest.fn()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', property: 'www.abc.com', version: '1'}

const fakeLocation = {query: {name: 'www.abc.com'}}

// Unused at the moment
// const fakeHost = Immutable.fromJS({
//   "status": 1,
//   "updated": 1453422142.746901,
//   "db_id": 6,
//   "account_id": "1",
//   "request_mode": "update_published_host",
//   "db_type": "redis",
//   "created": null,
//   "brand_id": "udn",
//   "published_host_id": "aaaaa",
//   "services": [
//     {
//       "updated": 1453422142.746678,
//       "description": "",
//       "end_date": "2017-01-21 19:22:22.745982",
//       "created": 1453422142.746019,
//       "object_id": "34c68a0c-c09e-11e5-bba1-04012bb11c01",
//       "summary": {
//         "status": "",
//         "published_name": "",
//         "last_editor": ""
//       },
//       "service_type": "media",
//       "__cs_service__": "Cloud Scale Service object",
//       "start_date": "2016-01-21 19:22:22.745982",
//       "configurations": [
//         {
//           "config_id": "1",
//           "request_policy": {"policy_rules": [
//             {
//               "match": {
//                 "default": [
//                   {
//                     "set": {
//                       "cache_control": {
//                         "no-store": true
//                       }
//                     }
//                   }
//                 ],
//                 "field": "request_path",
//                 "cases": [
//                   [
//                     "/videos/(.*)\\.mp4",
//                     [
//                       {
//                         "set": {
//                           "cache_name": {
//                             "name": [
//                               {
//                                 "field": "text",
//                                 "field_detail": "content/"
//                               },
//                               {
//                                 "field": "request_query_arg",
//                                 "field_detail": "itag"
//                               },
//                               {
//                                 "field": "text",
//                                 "field_detail": "/"
//                               },
//                               {
//                                 "field": "group",
//                                 "field_detail": "1"
//                               }
//                             ]
//                           }
//                         }
//                       }
//                     ]
//                   ],
//                   [
//                     "(.*)\\.m3u8",
//                     [
//                       {
//                         "set": {
//                           "cache_control": {
//                             "max-age": 10
//                           }
//                         }
//                       }
//                     ]
//                   ]
//                 ]
//               }
//             },
//             {
//               "match": {
//                 "field": "request_cookie",
//                 "cases": [
//                   [
//                     "mobile",
//                     [
//                       {
//                         "set": {
//                           "header": {
//                             "action": "set",
//                             "header": "X-optimize",
//                             "value": "yes"
//                           }
//                         }
//                       }
//                     ]
//                   ]
//                 ],
//                 "field_detail": "client_type"
//               }
//             }
//           ]},
//           "edge_configuration": {
//             "published_name": "examplffffffe.com",
//             "origin_host_name": "sdrgfdg.com",
//             "origin_host_port": 3333
//           },
//           "configuration_status": {
//             "last_edited_by": "Stan Laurel",
//             "last_edited": "10 Jan 2016 - 10:52",
//             "deployment_status": 2
//           },
//           "default_policy": {"policy_rules": [
//             {
//               "set": {
//                 "cache_control": {
//                   "honor_origin": true,
//                   "check_etag": "weak",
//                   "max_age": 0
//                 }
//               }
//             },
//             {
//               "set": {
//                 "cache_name": {
//                   "ignore_case": false
//                 }
//               }
//             }
//           ]},
//           "response_policy": {"policy_rules": [
//             {
//               "match": {
//                 "field": "response_code",
//                 "cases": [
//                   [
//                     "307",
//                     [
//                       {
//                         "match": {
//                           "field": "response_header",
//                           "cases": [
//                             [
//                               "origin1.example.com/(.*)",
//                               [
//                                 {
//                                   "set": {
//                                     "header": {
//                                       "action": "set",
//                                       "header": "Location",
//                                       "value": [
//                                         {
//                                           "field": "text",
//                                           "field_detail": "origin2.example.com/"
//                                         },
//                                         {
//                                           "field": "group",
//                                           "field_detail": "1"
//                                         }
//                                       ]
//                                     }
//                                   }
//                                 }
//                               ]
//                             ]
//                           ],
//                           "field_detail": "Location"
//                         }
//                       }
//                     ]
//                   ]
//                 ]
//               }
//             }
//           ]}
//         }
//       ]
//     }
//   ],
//   "group_id": "4",
//   "config_file_version": 1,
//   "description": ""
// })

// const fakeMetrics = Immutable.fromJS([
//   {
//     property: 'www.abc.com',
//     avg_cache_hit_rate: 1,
//     historical_traffic: [
//       {timestamp: new Date(1461258800000), bits_per_second: 1},
//       {timestamp: new Date(1461260800000), bits_per_second: 2}
//     ],
//     historical_variance: [],
//     traffic: [
//       {timestamp: new Date(1461268800000), bits_per_second: 3},
//       {timestamp: new Date(1461270800000), bits_per_second: 4}
//     ],
//     transfer_rates: {
//       peak: '3 Unit',
//       average: '2 Unit',
//       lowest: '1 Unit'
//     }
//   },
//   {
//     property: 'www.fake.com',
//     avg_cache_hit_rate: 2,
//     historical_traffic: [
//       {timestamp: new Date(1461258800000), bits_per_second: 10},
//       {timestamp: new Date(1461260800000), bits_per_second: 20}
//     ],
//     historical_variance: [],
//     traffic: [
//       {timestamp: new Date(1461268800000), bits_per_second: 30},
//       {timestamp: new Date(1461270800000), bits_per_second: 40}
//     ],
//     transfer_rates: {
//       peak: '6 Unit',
//       average: '5 Unit',
//       lowest: '4 Unit'
//     }
//   }
// ])

// const fakeVisitors = Immutable.fromJS({
//   "total":19080,
//   "countries": [
//     {
//       "name":"Sweden",
//       "percent_total":1
//     },
//     {
//       "name":"USA",
//       "percent_total":2
//     }
//   ]
// })

describe('Property', () => {
  it('should exist', () => {
    const property = TestUtils.renderIntoDocument(
      <Property
        params={urlParams}
        location={fakeLocation}
        fetching={true}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        hostActions={hostActionsMaker()}
        metricsActions={metricsActionsMaker()}
        trafficActions={trafficActionsMaker()}
        visitorsActions={visitorsActionsMaker()} />
    );
    expect(TestUtils.isCompositeComponent(property)).toBeTruthy();
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    TestUtils.renderIntoDocument(
      <Property
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        hostActions={hostActions}
        metricsActions={metricsActionsMaker()} fetching={true}
        params={urlParams} location={fakeLocation}
        trafficActions={trafficActionsMaker()}
        visitorsActions={visitorsActionsMaker()}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });

  it('should toggle property menu', () => {
    const property = TestUtils.renderIntoDocument(
      <Property
        params={urlParams}
        location={fakeLocation}
        fetching={true}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        hostActions={hostActionsMaker()}
        metricsActions={metricsActionsMaker()}
        trafficActions={trafficActionsMaker()}
        visitorsActions={visitorsActionsMaker()} />
    )
    expect(property.state.propertyMenuOpen).toBe(false)
    property.togglePropertyMenu()
    expect(property.state.propertyMenuOpen).toBe(true)
  });

  it('should show a notification', () => {
    const uiActions = uiActionsMaker()
    const property = TestUtils.renderIntoDocument(
      <Property
        params={urlParams}
        location={fakeLocation}
        fetching={true}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        hostActions={hostActionsMaker()}
        metricsActions={metricsActionsMaker()}
        trafficActions={trafficActionsMaker()}
        uiActions={uiActions}
        visitorsActions={visitorsActionsMaker()} />
    )
    property.showNotification('aaa')
    expect(uiActions.changeNotification.mock.calls[0][0]).toBe('aaa')
  })

  it('should toggle purge form', () => {
    const purgeActions = purgeActionsMaker()
    const property = TestUtils.renderIntoDocument(
      <Property
        params={urlParams}
        location={fakeLocation}
        fetching={true}
        accountActions={accountActionsMaker()}
        groupActions={groupActionsMaker()}
        hostActions={hostActionsMaker()}
        metricsActions={metricsActionsMaker()}
        purgeActions={purgeActions}
        trafficActions={trafficActionsMaker()}
        visitorsActions={visitorsActionsMaker()} />
    )
    expect(property.state.purgeActive).toBe(false)
    property.togglePurge()
    expect(property.state.purgeActive).toBe(true)
    expect(purgeActions.resetActivePurge.mock.calls.length).toBe(1)
  });
})
