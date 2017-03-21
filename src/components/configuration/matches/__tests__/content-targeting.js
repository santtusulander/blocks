import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import Select from '../../../select'

jest.unmock('../content-targeting.jsx')
jest.unmock('../../../../util/policy-config.js')
const ContentTargeting = require('../content-targeting.jsx')

describe('ContentTargeting', () => {
  const fakeConfig = Immutable.fromJS({
    "value": [["foo"]]
  })

  const fakePath = Immutable.List(['foo', 'bar'])

  const subject = (props = {}) => {
    return shallow(
      <ContentTargeting
        match={fakeConfig}
        path={fakePath}
        {...props} />
    )
  }

  it('should exist', () => {
    expect(subject()).toBeDefined()
  })

  //TODO-2277

  // it('should save changes', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   const component = subject({changeValue, close})
  //   component.setState({
  //     includes: [{id: 'US'}],
  //     excludes: [{id: 'CA'}]
  //   })
  //   component.instance().saveChanges()
  //   expect(close.mock.calls.length).toBe(1)
  //   expect(changeValue.mock.calls.length).toBe(1)

  //   expect(changeValue.mock.calls[0][0]).toEqual(Immutable.List(['foo', 'bar']))
    // expect(changeValue.mock.calls[0][1]).toEqual(Immutable.fromJS(
    //   {
    //     "cases": [
    //       [
    //         ".*",
    //         [
    //           {
    //             "script_lua": {
    //               "target": {
    //                 "geo": [
    //                   {
    //                     "country": [
    //                       {
    //                         "in": [
    //                           "US"
    //                         ],
    //                         "response": {
    //                           "code": 200
    //                         }
    //                       },
    //                       {
    //                         "in": [
    //                           "CA"
    //                         ],
    //                         "response": {
    //                           "code": 401
    //                         }
    //                       }
    //                     ]
    //                   }
    //                 ]
    //               }
    //             }
    //           }
    //         ]
    //       ]
    //     ],
    //     "field": "request_host"
    //   }
    // ))
  //})
})
