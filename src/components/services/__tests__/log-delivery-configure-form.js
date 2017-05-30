import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'

import LogDeliveryConfigureForm from '../log-delivery-configure-form.jsx'

jest.unmock('../log-delivery-configure-form.jsx')

describe('LogDeliveryConfigureForm', () => {
  let handleSubmit, onCancel, onSave, change, changeValue, component

  beforeEach(() => {
    handleSubmit = jest.fn()
    onCancel = jest.fn()
    onSave = jest.fn()
    change = jest.fn()
    changeValue = jest.fn()

    let props = {
      change,
      changeValue,
      handleSubmit,
      onCancel,
      onSave,
      invalid: false
    }

    component = shallow(<LogDeliveryConfigureForm {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should have 2 buttons', () => {
    expect(component.find('Button').length).toBe(2)
  })

  it('should have 8 fields', () => {
    expect(component.find('Field').length).toBe(7)
    expect(component.find('Fields').length).toBe(1)
  })

  it('should submit form', () => {
    component.find('form').simulate('submit')
    expect(handleSubmit).toBeCalled();
  })

  it('should handle onCancel click', () => {
    component.find('#cancel-btn').simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })
})
