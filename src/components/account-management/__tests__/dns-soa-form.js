describe('SoaEditForm', () => {
  // Jest requires test suites to have at least one test
  it("should satisfy Jest until Modals can be tested", () => { expect(true).toBeTruthy() })
})

/*import React from 'react'
import { fromJS } from 'immutable'
import { mount, shallow } from 'enzyme'
import { reducer as form } from 'redux-form'
import { createStore } from 'redux'
import { combineReducers } from 'redux'
import jsdom from 'jsdom'

jest.unmock('../../button.js')
jest.unmock('../../account-management/dns-soa-form.jsx')
jest.genMockFromModule('react-bootstrap')
import FormContainer, { SoaEditForm } from '../../account-management/dns-soa-form.jsx'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

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
    expect(subject().find('#domain_name .error-msg').text()).toBe(REQUIRED)
  })
})

describe("Connected SoaEditForm", () => {
  let store = null
  let props = null
  let subject = null
  beforeEach(() => {
    store = createStore(combineReducers({form}))
    props = {
      activeDomain: fromJS({}),
      store
    }
  })
  describe("Blank input errors", () => {
    beforeEach(() => {
      subject = mount(<FormContainer {...props}/>)
    })
    it("shows error message when domain name is blank", () => {
      const input = subject.find('#domain_name .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#domain_name .error-msg').text()).toBe(REQUIRED)
    })

    it("shows error message when primary nameserver is blank", () => {
      const input = subject.find('#primary_nameserver .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#primary_nameserver .error-msg').text()).toBe(REQUIRED)
    })

    it("shows error message when responsible person is blank", () => {
      const input = subject.find('#responsible_person_mailbox .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(REQUIRED)
    })

    it("shows error message when responsible person is blank", () => {
      const input = subject.find('#responsible_person_mailbox .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(REQUIRED)
    })

    it("shows error message when zone serial # is blank", () => {
      const input = subject.find('#zone_serial_number .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#zone_serial_number .error-msg').text()).toBe(REQUIRED)
    })

    it("shows error message when refresh is blank", () => {
      const input = subject.find('#refresh .soa-form-input').first()
      input.simulate('blur')
      expect(subject.find('#refresh .error-msg').text()).toBe(REQUIRED)
    })
  })
  describe("Validation errors", () => {
    let store = null
    let props = null
    let subject = null
    beforeEach(() => {
      store = createStore(combineReducers({form}))
      props = {
        activeDomain: fromJS({}),
        store,
        initialValues: {
          domainName: 'aaa',
          nameServer: 'bbb',
          personResponsible: 'ccc',
          refresh: 'ddd',
          zoneSerialNumber: 'eee'
        }
      }
      subject = mount(<FormContainer {...props}/>)
    })
    it("shows error message when responsible person is invalid", () => {
      const input = subject.find('#responsible_person_mailbox .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#responsible_person_mailbox .error-msg').text()).toBe(INVALID_INPUT)
    })

    it("shows error message when zone serial # is invalid", () => {
      const input = subject.find('#zone_serial_number .soa-form-input')
      input.simulate('blur')
      expect(subject.find('#zone_serial_number .error-msg').text()).toBe(INVALID_INPUT)
    })

    it("shows error message when refresh is invalid", () => {
      const input = subject.find('#refresh .soa-form-input').first()
      input.simulate('blur')
      expect(subject.find('#refresh .error-msg').text()).toBe(INVALID_INPUT)
    })
  })
})
*/
