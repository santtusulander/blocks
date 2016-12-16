// import React from 'react'
// import { mount, shallow, render } from 'enzyme'
//
// import { createStore, combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
//
// jest.unmock('../../../components/account-management/brand-edit-form');
// jest.unmock('../../../components/udn-file-input');
// jest.unmock('../../../components/select-wrapper');
// import BrandEditForm from '../../../components/account-management/brand-edit-form'


describe("BrandEditForm", () => {

  // let store = null
  // let subject = null
  //
  // beforeEach(() => {
  //   store = createStore(combineReducers({form: formReducer}))
  //   const props = {
  //     store,
  //   }
  //
  //   subject = mount(<BrandEditForm {...props} />)
  // })

  // Jest requires test suites to have at least one test
  it("should satisfy Jest until Modals can be tested", () => { expect(true).toBeTruthy() })

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

    const inputs = subject.find('FormControl')
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
