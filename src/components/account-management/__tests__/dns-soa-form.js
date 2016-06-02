import React from 'react'
import { fromJS } from 'immutable'
import { mount, shallow } from 'enzyme'

jest.dontMock('redux')
jest.dontMock('react-redux')
const formReducer = require('redux-form').reducer
const createStore = require('redux').createStore
const combineReducers = require('redux').combineReducers

jest.dontMock('../../account-management/dns-soa-form.jsx')
import FormContainer, { SoaEditForm } from '../../account-management/dns-soa-form.jsx'

const REQUIRED = 'Required'
/*describe('SoaEditForm', () => {

  it('should exist', () => {
    const form = shallow(
        <SoaEditForm/>
    )
    expect(form.length).toBe(1)
  })

})*/

describe("Connected SoaEditForm", () => {
  let store = null
  let subject = null
  beforeEach(() => {
    store = createStore(combineReducers({ form: formReducer }))
    const props = {
      store
    }
    subject = mount(<FormContainer {...props}/>)
  })

  it("shows error message when domain name is blank", () => {
    const input = subject.find('ConnectedForm')
    console.log(input.find('Modal'))
    input.simulate('blur')
    expect(subject.find('#domain_name .error-msg').text()).toBe(REQUIRED)
  })

 /* it("shows error message when primary nameserver is blank", () => {
    const input = subject.find('#primary_nameserver .soa-form-input')
    input.simulate('blur')
    expect(subject.find('#primary_nameserver .error-msg').text()).toBe(REQUIRED)
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
  })*/
})
