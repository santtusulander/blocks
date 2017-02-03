import React from 'react'
import Immutable from 'immutable'
import { shallow, mount, render } from 'enzyme'
import { reducer as form } from 'redux-form'
import { createStore, combineReducers } from 'redux'

jest.unmock('../account-form.jsx')
jest.unmock('../../../decorators/key-stroke-decorator')
jest.genMockFromModule('react-bootstrap')

import AccountForm from '../account-form.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const fetchServiceInfo = () => Immutable.Map()
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = () => {
      props = {
        onCancel,
        onSave,
        fetchServiceInfo,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          accountBrand: 'udn'
        },
        fields: {
          accountName: { touched, error, value: '' },
          accountBrand: { touched, error, value: '' },
          accountType: { touched, error, value: '' },
          services: { touched, error, value: [] },
        }
      }
      return shallow(<AccountForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(
      subject()
        .find('input .error-msg')
        .at(0)
    ).toBeTruthy()
  })
})

describe('Connected AccountForm', () => {
  let store, subject, error, props = null
  let touched = false

  const onCancel = jest.fn()
  const onSave = jest.fn()

  beforeEach(() => {
    store = createStore(combineReducers({ form }), () => form)
    props = {
      show: true,
      store,
      intl: intlMaker(),
      fields: {
        accountName: { touched, error, value: '' },
        accountBrand: { touched, error, value: '' },
        accountType: { touched, error, value: '' },
        services: { touched, error, value: '' },
      },
      initialValues: {
        accountName: '',
        accountBrand: '',
        accountType: '',
        services: ''
      }
    }
  })

  describe('Blank input errors', () => {

    beforeEach(() => {
      subject = mount(<AccountForm {...props}/>)
    })

    // it('shows error message when account name is blank', () => {
    //   const input = subject.find('#account-name')
    //   input.simulate('blur')
    //   expect(subject.find('.error-msg').text()).toBe('')
    // })
  })
})
