import React from 'react'
import { fromJS } from 'immutable'
import { mount, shallow } from 'enzyme'
import { reducer as form } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import jsdom from 'jsdom'

import NewAccountForm from '../account-form.jsx'

jest.unmock('../account-form.jsx')


describe('AccountForm', () => {

  const onSave = jest.genMockFunction()
  const onCancel = jest.genMockFunction()
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = () => {
      props = {
        onSave,
        onCancel,
        fields: {
          accountName: { touched, error, value: '' },
          accountBrand: { touched, error, value: '' },
          accountType: { touched, error, value: '' },
          services: { touched, error, value: '' },
        }
      }
      return shallow(<NewAccountForm {...props} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
