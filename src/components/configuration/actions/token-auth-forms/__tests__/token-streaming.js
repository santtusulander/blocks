import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../token-streaming.jsx')

import TokenStreaming from '../token-streaming.jsx'

describe('TokenStreaming', () => {
  const intlMaker = () => { return { formatMessage: jest.fn() } }
  let handleSubmit, close, change, component

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      intl: intlMaker()
    }

    component = shallow(<TokenStreaming {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
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
