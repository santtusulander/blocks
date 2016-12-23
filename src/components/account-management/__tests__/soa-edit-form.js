import React from 'react'
import { fromJS } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../soa-edit-form')
import { SoaEditForm } from '../soa-edit-form'

const REQUIRED = 'Required'
const INVALID_INPUT = 'Invalid input'

describe('SoaEditForm', () => {
  const onSave = jest.genMockFunction()
  const onCancel = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = () => {
      props = {
        onSave,
        onCancel,
        activeDomain: fromJS({}),
        fields: {
          domainName: { touched, error, value: '' },
          nameServer: { touched, error, value: '' },
          personResponsible: { touched, error, value: '' },
          refresh: { touched, error, value: '' },
          zoneSerialNumber: { touched, error, value: '' }
        }
      }
      return shallow(<SoaEditForm {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should handle onSave click', () => {
    subject().find('#save_button').simulate('click')
    expect(onSave.mock.calls.length).toBe(1)
  })

  it('should handle onCancel click', () => {
    subject().find('#cancel_button').simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    error = REQUIRED
    expect(subject().find('#domain_name .error-msg').text()).toBe("<HelpBlock />")
  })

// describe("Connected SoaEditForm", () => {
//   let store = null
//   let props = null
//   let subject = null
//   beforeEach(() => {
//     store = createStore(combineReducers({form}))
//     props = {
//       activeDomain: fromJS({}),
//       store
//     }
//   })
//   describe("Blank input errors", () => {
//     beforeEach(() => {
//       subject = mount(<FormContainer {...props}/>)
//     })
//     it("shows error message when domain name is blank", () => {
//       const input = subject.find('#domain_name .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#domain_name .error-msg').text()).toBe(REQUIRED)
//     })
//
//     it("shows error message when primary nameserver is blank", () => {
//       const input = subject.find('#primary_nameserver .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#primary_nameserver .error-msg').text()).toBe(REQUIRED)
//     })
//
//     it("shows error message when responsible person is blank", () => {
//       const input = subject.find('#responsible_person_mailbox .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(REQUIRED)
//     })
//
//     it("shows error message when responsible person is blank", () => {
//       const input = subject.find('#responsible_person_mailbox .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(REQUIRED)
//     })
//
//     it("shows error message when zone serial # is blank", () => {
//       const input = subject.find('#zone_serial_number .soa-form-input')
//       input.simulate('blur')
//       expect(subject.find('#zone_serial_number .error-msg').text()).toBe(REQUIRED)
//     })
//
//     it("shows error message when refresh is blank", () => {
//       const input = subject.find('#refresh .soa-form-input').first()
//       input.simulate('blur')
//       expect(subject.find('#refresh .error-msg').text()).toBe(REQUIRED)
//     })
//   })
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
})
