import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../token-authentication.jsx')

import TokenAuthentication from '../token-authentication.jsx'

describe('TokenAuthentication', () => {
  const intlMaker = () => { return { formatMessage: jest.fn() } }
  let handleSubmit, close, change, component

  const VOD_STREAMING_TOKEN_AUTH = 'VOD_STREAMING_TOKEN_AUTH'

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      set: Map(),
      intl: intlMaker(),
      tokenValues: {}
    }

    component = shallow(<TokenAuthentication {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
  })

  it('should render 2 advanced options', () => {
    expect(component.find('.options-item').length).toBe(2)
  })

  it('should show schema sidepanel', () => {
    component.find('.arrow-right a').at(0).simulate('click', {
      stopPropagation: () => false
    })

    expect(component.state('detailForm')).toBe('schema')
  })

  it('should show streaming sidepanel', () => {
    component.find('.arrow-right a').at(1).simulate('click', {
      stopPropagation: () => false
    })

    expect(component.state('detailForm')).toBe('streaming')
  })

  it('should handle cancel click', () => {
    component.find('Button').at(0).simulate('click')

    expect(close.mock.calls.length).toBe(1)
  })

  it('should handle submit click', () => {
    component.find('Button').at(1).simulate('click')

    expect(handleSubmit.mock.calls.length).toBe(1)
  })

})
