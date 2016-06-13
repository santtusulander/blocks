import React from 'react'
import { mount, shallow, render } from 'enzyme'

import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import jsdom from 'jsdom'

jest.unmock('../../../components/account-management/brand-edit-form');
jest.unmock('../../../components/udn-file-input');
jest.unmock('../../../components/select-wrapper');
import BrandEditForm from '../../../components/account-management/brand-edit-form'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView


describe("BrandEditForm", () => {

  let store = null
  let subject = null

  beforeEach(() => {
    store = createStore(combineReducers({form: formReducer}))
    const props = {
      store,
    }

    subject = mount(<BrandEditForm {...props} />)
  })

  /* Commented out because Modals cannot be tested ATM
  it("should exist", () => {
    const modal = subject.find('.brands-edit-sidebar');
    expect(modal.length).toBe(1);
  })

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
