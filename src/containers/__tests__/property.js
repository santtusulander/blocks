import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()

jest.dontMock('../property.jsx')
const Property = require('../property.jsx').Property

function hostActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchHost: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', version: '1'}

const fakeLocation = {query: {name: 'www.abc.com'}}

const fakeHost = Immutable.fromJS({
  "status": 1,
  "updated": 1453422142.746901,
  "db_id": 6,
  "account_id": "1",
  "request_mode": "update_published_host",
  "db_type": "redis",
  "created": null,
  "brand_id": "udn",
  "published_host_id": "aaaaa",
  "services": [
    {
      "updated": 1453422142.746678,
      "description": "",
      "end_date": "2017-01-21 19:22:22.745982",
      "created": 1453422142.746019,
      "object_id": "34c68a0c-c09e-11e5-bba1-04012bb11c01",
      "summary": {
        "status": "",
        "published_name": "",
        "last_editor": ""
      },
      "service_type": "media",
      "__cs_service__": "Cloud Scale Service object",
      "start_date": "2016-01-21 19:22:22.745982",
      "configurations": [
        {
          "config_id": "1",
          "request_policies": [
            {
              "match": {
                "default": [
                  {
                    "set": {
                      "cache_control": {
                        "no-store": true
                      }
                    }
                  }
                ],
                "field": "request_path",
                "cases": [
                  [
                    "/videos/(.*)\\.mp4",
                    [
                      {
                        "set": {
                          "cache_name": {
                            "name": [
                              {
                                "field": "text",
                                "field_detail": "content/"
                              },
                              {
                                "field": "request_query_arg",
                                "field_detail": "itag"
                              },
                              {
                                "field": "text",
                                "field_detail": "/"
                              },
                              {
                                "field": "group",
                                "field_detail": "1"
                              }
                            ]
                          }
                        }
                      }
                    ]
                  ],
                  [
                    "(.*)\\.m3u8",
                    [
                      {
                        "set": {
                          "cache_control": {
                            "max-age": 10
                          }
                        }
                      }
                    ]
                  ]
                ]
              }
            },
            {
              "match": {
                "field": "request_cookie",
                "cases": [
                  [
                    "mobile",
                    [
                      {
                        "set": {
                          "header": {
                            "action": "set",
                            "header": "X-optimize",
                            "value": "yes"
                          }
                        }
                      }
                    ]
                  ]
                ],
                "field_detail": "client_type"
              }
            }
          ],
          "edge_configuration": {
            "published_name": "examplffffffe.com",
            "origin_host_name": "sdrgfdg.com",
            "origin_host_port": "3333"
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52",
            "environment": "staging"
          },
          "default_policies": [
            {
              "set": {
                "cache_control": {
                  "honor_origin": true,
                  "check_etag": "weak"
                }
              }
            },
            {
              "set": {
                "cache_name": {
                  "ignore_case": false
                }
              }
            }
          ],
          "response_policies": [
            {
              "match": {
                "field": "response_code",
                "cases": [
                  [
                    "307",
                    [
                      {
                        "match": {
                          "field": "response_header",
                          "cases": [
                            [
                              "origin1.example.com/(.*)",
                              [
                                {
                                  "set": {
                                    "header": {
                                      "action": "set",
                                      "header": "Location",
                                      "value": [
                                        {
                                          "field": "text",
                                          "field_detail": "origin2.example.com/"
                                        },
                                        {
                                          "field": "group",
                                          "field_detail": "1"
                                        }
                                      ]
                                    }
                                  }
                                }
                              ]
                            ]
                          ],
                          "field_detail": "Location"
                        }
                      }
                    ]
                  ]
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  "group_id": "4",
  "config_file_version": 1,
  "description": ""
})

describe('Property', () => {
  it('should exist', () => {
    const property = TestUtils.renderIntoDocument(
      <Property
        params={urlParams}
        location={fakeLocation}
        fetching={true}
        hostActions={hostActionsMaker()} />
    );
    expect(TestUtils.isCompositeComponent(property)).toBeTruthy();
  });

  it('should request data on mount', () => {
    const hostActions = hostActionsMaker()
    TestUtils.renderIntoDocument(
      <Property hostActions={hostActions} fetching={true}
        params={urlParams} location={fakeLocation}/>
    )
    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });

  it('should display the property name', () => {
    const property = TestUtils.renderIntoDocument(
      <Property hostActions={hostActionsMaker()}
        params={urlParams} location={fakeLocation}
        activeHost={fakeHost}/>
    )
    let header = TestUtils.findRenderedDOMComponentWithClass(property, 'property-header')
    expect(header.textContent).toContain('www.abc.com')
  });
})
