import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../token-authentication.jsx')
jest.unmock('react-bootstrap')
jest.unmock('redux-form')

const TokenAuthentication = require('../token-authentication.jsx').TokenAuthentication

describe('TokenAuthentication', () => {
  const intlMaker = () => { return { formatMessage: jest.fn() } }
  let changeValue, onChange, close
  let component, buttons

  beforeEach(() => {
    changeValue = jest.fn()
    onChange = jest.fn()
    close = jest.fn()

    let props = {
      changeValue,
      close,
      set: Map(),
      fields: { sharedKey: { onChange } },
      intl: intlMaker()
    }

    component = shallow(<TokenAuthentication {...props} />)
    buttons = component.find('Button')
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
  })

  it('should update internal state as changes happen', () => {
    let inputs = component.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'c2hhcmVkLXNlY3JldA=='}})
    expect(onChange).toHaveBeenCalled()
    expect(changeValue).not.toHaveBeenCalled()
  })

  it('should discard changes on cancel', () => {
    buttons.at(0).simulate('click')
    expect(changeValue).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })

  it('should save changes and then close', () => {
    buttons.at(1).simulate('click')
    expect(changeValue).toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })
})
