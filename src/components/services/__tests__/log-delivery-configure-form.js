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
})
