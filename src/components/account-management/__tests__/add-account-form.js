import React from 'react'
import { fromJS } from 'immutable'
import { shallow, mount } from 'enzyme'
import { reducer as form } from 'redux-form'
import { createStore } from 'redux'
import { combineReducers } from 'redux'
import jsdom from 'jsdom'

jest.unmock('../../account-management/account-form.jsx')
jest.genMockFromModule('react-bootstrap')
import AccountForm from '../../account-management/account-form.jsx'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

describe('AccountForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false

  const intlMaker = () => {
    return {
      formatMessage: jest.fn()
    }
  }

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
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const store = createStore(combineReducers({ form }))
  let subject, error, props = null
  let touched = false

  const intlMaker = () => {
    return {
      formatMessage: jest.fn()
    }
  }

  beforeEach(() => {
    subject = () => {
      props = {
        onCancel,
        onSave,
        store,
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
})
// describe('Connected AccountForm', () => {
//   const onCancel = jest.fn()
//   const onSave = jest.fn()
//   let subject, error, props = null
//   let store = null
//   let touched = false
//
//   const intlMaker = () => {
//     return {
//       formatMessage: jest.fn()
//     }
//   }
//
//   beforeEach(() => {
//     store = createStore(combineReducers({ form }))
//     props = {
//       onCancel,
//       onSave,
//       intl: intlMaker(),
//       fields: {
//         accountName: { touched, error, value: '' },
//         accountBrand: { touched, error, value: '' },
//         accountType: { touched, error, value: '' },
//         services: { touched, error, value: '' },
//       }
//     }
//   })
//
//   describe('Blank input errors', () => {
//     beforeEach(() => {
//       subject = mount(<AccountForm {...props}/>)
//     })
//     it('shows error message when domain name is blank', () => {
//       const input = subject.find('#domain_name .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#domain_name .error-msg').text()).toBe(REQUIRED)
//     })
//   })
// })

//   describe("Validation errors", () => {
//     let store = null
//     let props = null
//     let subject = null
//     beforeEach(() => {
//       store = createStore(combineReducers({form}))
//       props = {
//         activeDomain: fromJS({}),
//         store,
//         initialValues: {
//           domainName: 'aaa',
//           nameServer: 'bbb',
//           personResponsible: 'ccc',
//           refresh: 'ddd',
//           zoneSerialNumber: 'eee'
//         }
//       }
//       subject = mount(<FormContainer {...props}/>)
//     })
//     it("shows error message when responsible person is invalid", () => {
//       const input = subject.find('#responsible_person_mailbox .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(INVALID_INPUT)
//     })
//
//     it("shows error message when zone serial # is invalid", () => {
//       const input = subject.find('#zone_serial_number .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#zone_serial_number .error-msg').text()).toBe(INVALID_INPUT)
//     })
//
//     it("shows error message when refresh is invalid", () => {
//       const input = subject.find('#refresh .soa-form-input').first()
//       input.simulate('blur')
//       expect(subject.find('#refresh .error-msg').text()).toBe(INVALID_INPUT)
//     })
//   })
// })
