import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../content-targeting.jsx')
jest.unmock('../../../../constants/country-list.js')

import ContentTargeting from '../content-targeting.jsx'
import country_list from '../../../../constants/country-list'

describe('ContentTargeting', () => {
  let handleSubmit, change, close, intl, component
  const fakeConfig = Immutable.fromJS({
    "value": ['UA']
  })

  const fakePath = Immutable.List(['foo', 'bar'])
  const intlMaker = () => { return { formatMessage: jest.fn() } }

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      match: fakeConfig,
      path: fakePath,
      intl: intlMaker()
    }

    component = shallow(<ContentTargeting {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeDefined()
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
