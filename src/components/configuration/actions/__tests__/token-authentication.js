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

  // it('should update internal state as changes happen', () => {
  //   let inputs = component.find('FormControl')
  //   inputs.at(0).simulate('change', {target: {value: 'c2hhcmVkLXNlY3JldA=='}})
  //   expect(change).toHaveBeenCalled()
  //   expect(changeValue).not.toHaveBeenCalled()
  // })

  // it('should discard changes on cancel', () => {
  //   buttons.at(0).simulate('click')
  //   expect(changeValue).not.toHaveBeenCalled()
  //   expect(close).toHaveBeenCalled()
  // })

  // it('should save changes and then close', () => {
  //   buttons.at(1).simulate('click')
  //   expect(changeValue).toHaveBeenCalled()
  //   expect(close).toHaveBeenCalled()
  // })
})
