//jest.unmock('../../../containers/dns-edit-form-container');
jest.unmock('../../../components/account-management/dns-edit-form');

import React from 'react'
import { mount, shallow, render } from 'enzyme'

//import DnsEditFormContainer from '../../../containers/dns-edit-form-container'
import DnsEditForm from '../../../components/account-management/dns-edit-form'

import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import jsdom from 'jsdom'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView




describe("DnsEditFormContainer", () => {

  let store = null
  let subject = null

  beforeEach(() => {
    store = createStore(combineReducers({form: formReducer}))
    const props = {
      store,
    }

    subject = mount(<DnsEditForm {...props} />)
  })


  /* Commented out because Modals cannot be tested ATM
  it("should have 'form", () => {

    const form = subject.find('form')
    expect( form.length ).toBe(1);
  })

  it("should have 3 inputs", () => {

    const inputs = subject.find('input')
    expect( inputs.length ).toBe(3)
  })

  it("shows error if recordName set to blank", () => {
    const input = subject.find(".recordNameInput")

    input.simulate('change', { target: { value: '' } })
    input.simulate('click')
    const errMsg = subject.find('.errorRecordName')
    expect(errMsg).to.exist()
  })
  */
});
