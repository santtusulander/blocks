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
  const mockProviderTypes = [{
    value: 1,
    label: (<div id="testLabel">Test</div>)
  }]
  const mockAccount = Immutable.fromJS({
    id: 1,
    name: 'Test'
  })

  beforeEach(() => {
    subject = (errorMsg, accountProp, accountType, providerTypes = mockProviderTypes) => {
      props = {
        account: accountProp,
        error: errorMsg,
        onCancel,
        onSave,
        fetchServiceInfo,
        accountType,
        providerTypes,
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

  it('should render form', () => {
    expect(subject().find('form').length).toBe(1)
  })

  it('should render 2 Buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should render 3 Fields', () => {
    expect(subject("").find('Field').length).toBe(3)
  })

  it('should render 2 Fields if account is passed', () => {
    expect(subject("", mockAccount).find('Field').length).toBe(2)
  })

  it('should render error messages', () => {
    expect(subject("error").find('.submit-error').text()).toBe("error")
  })

  it('should not render error messages if empty', () => {
    expect(subject("").find('.submit-error').text()).toBe("")
  })

  it('should show label if account type and provider type match', () => {
    expect(subject("", mockAccount, 1, mockProviderTypes).find('#testLabel').length).toBe(1)
  })

  it('should not label if account type and provider type does not match', () => {
    expect(subject("", mockAccount, 2, mockProviderTypes).find('#testLabel').length).toBe(0)
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
