import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../token-authentication.jsx')

const TokenAuthentication = require('../token-authentication.jsx').TokenAuth

describe('TokenAuthentication', () => {
  const intlMaker = () => { return { formatMessage: jest.fn() } }
  let handleSubmit, onChange, close, change
  let component, buttons

  beforeEach(() => {
    handleSubmit = jest.fn()
    onChange = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      set: Map(),
      intl: intlMaker()
    }

    component = shallow(<TokenAuthentication {...props} />)
    buttons = component.find('Button')
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
  })

})
