import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../content-targeting.jsx')
jest.unmock('../../../../constants/country-list.js')

import ContentTargeting from '../content-targeting.jsx'
import country_list from '../../../../constants/country-list'

describe('ContentTargeting', () => {
  let handleSubmit, change, close, intl, component, changeValue, activateMatch
  const fakeConfig = Immutable.fromJS({
    field: "content_targeting_country_code",
    "value": ['UA']
  })

  const fakePath = Immutable.List(['foo', 'bar'])
  const intlMaker = () => { return { formatMessage: jest.fn() } }

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()
    changeValue = jest.fn()
    activateMatch = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      changeValue,
      activateMatch,
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

  it('should save changes', () => {
    const values = {
      value: [{id: 'UA'}],
      inverted: false
    }

    component.instance().saveChanges(values)

    expect(changeValue.mock.calls.length).toBe(1)
    expect(changeValue.mock.calls[0][0]).toEqual(Immutable.List(['foo', 'bar']))
    expect(changeValue.mock.calls[0][1].toJS()).toEqual(
      {
        field: "content_targeting_country_code",
        value: ['UA'],
        type: 'in',
        inverted: false
      }
    )
  })
})
