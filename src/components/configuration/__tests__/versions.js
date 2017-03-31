import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../versions.jsx')
import ConfigurationVersions from '../versions.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeConfigs = Immutable.fromJS([
  {config_id: 1, configuration_status: {deployment_status: 2}},
  {config_id: 2, configuration_status: {deployment_status: 3}},
  {config_id: 3, configuration_status: {}}
])

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
          "request_policy": {"policy_rules": [
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
          ]},
          "edge_configuration": {
            "published_name": "examplffffffe.com",
            "origin_host_name": "sdrgfdg.com",
            "origin_host_port": 3333
          },
          "configuration_status": {
            "last_edited_by": "Stan Laurel",
            "last_edited": "10 Jan 2016 - 10:52",
            "deployment_status": 2
          },
          "defaults": {
            "cache_control_max_age": null,
            "cache_key_query": null,
            "cache_control_check_etag": "false",
            "response_remove_vary": true,
            "cache_control_honor_origin": false,
            "cache_name_ignore_case": true
          },
          "response_policy": {"policy_rules": [
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
          ]}
        }
      ]
    }
  ],
  "group_id": "4",
  "config_file_version": 1,
  "description": ""
})

describe('ConfigurationVersions', () => {
  it('should exist', () => {
    let versions = shallow(<ConfigurationVersions fetching={true} />)
    expect(versions.length).toBe(1)
  })

  it('should display configurations', () => {
    const versions = shallow(
      <ConfigurationVersions intl={intlMaker()}
        configurations={fakeConfigs}
        activeHost={fakeHost}/>
    )
    expect(versions.find('SidebarLinks').length).toBe(4)
  })

  it('should add a verson', () => {
    const addVersion = jest.fn()
    let versions = shallow(
      <ConfigurationVersions intl={intlMaker()}
        configurations={fakeConfigs}
        addVersion={addVersion}
        activeHost={fakeHost}/>
    )
    versions.find('.add-btn').simulate('click')
    expect(addVersion.mock.calls[0]).toBeDefined()
  })
})
