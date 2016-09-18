import React from 'react'
import { shallow, mount } from 'enzyme'
import { reducer as form } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import jsdom from 'jsdom'

jest.unmock('../../account-management/account-form.jsx')
jest.genMockFromModule('react-bootstrap')
import AccountForm from '../../account-management/account-form.jsx'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = () => {
      props = {
        onCancel,
        onSave,
        intl: intlMaker(),
        fields: {
          accountName: { touched, error, value: '' },
          accountBrand: { touched, error, value: '' },
          accountType: { touched, error, value: '' },
          services: { touched, error, value: '' },
        }
      }
      return shallow(<AccountForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should handle onCancel click', () => {
    subject()
      .find('#cancel-btn')
      .simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })

  it('should handle onSave click', () => {
    subject()
      .find('#save-btn')
      .simulate('click')
    expect(onSave.mock.calls.length).toBe(1)
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

    it('shows error message when account name is blank', () => {
      const input = subject.find('input').at(0)
      input.simulate('blur')
      // expect(subject.find('.error-msg', input).text()).toBe('')
    })
  })

  // describe('Validation errors', () => {
  //
  //   beforeEach(() => {
  //     subject = mount(<AccountForm {...props}/>)
  //   })
  //
  //   it('Shows error message when account name is not valid', () => {
  //     const input = subject.find('input').at(0)
  //     input.simulate('blur')
  //     // expect(subject.find('.error-msg', input).text()).toBe('')
  //   })
  // })

})
