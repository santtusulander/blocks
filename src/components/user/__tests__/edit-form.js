import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../edit-form.jsx')
import UserEditForm from '../edit-form.jsx'

function intlMaker() {
  return {
   formatMessage: jest.fn()
  }
}

function makeFakeFields() {
  return {
    confirm: {
      value: "test"
    },
    current_password: {
      value: "test"
    },
    email: {
      value: "test"
    },
    first_name: {
      value: "test"
    },
    last_name: {
      value: "test"
    },
    middle_name: {
      value: "test"
    },
    new_password: {
      value: "test"
    },
    phone: {
      value: "test"
    },
    phone_country_code: {
      value: "test"
    },
    phone_number: {
      value: "test"
    },
    timezon: {
      value: "test"
    },
    tfa_toggle: {
      value: "tfa_toggle"
    },
    tfa: {
      value: "test"
    }
  }
}

describe('UserEditForm', () => {
  let subject, props = null

  const fields = makeFakeFields()
  const intl = intlMaker()
  const initialValues = { email: "abc@example.com" }
  const invalid = false
  const handleSubmit = jest.genMockFunction()
  const onSave = jest.genMockFunction()
  const onSavePassword = jest.genMockFunction()

  beforeEach(() => {
     subject = () => {
       props = {
         handleSubmit,
         fields,
         initialValues,
         intl,
         formValues: {language: 'en-US'},
         invalid,
         onSave,
         onSavePassword,
       }

       return shallow(<UserEditForm {...props}/>)
     }
   })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })

   it('should have form', () => {
     expect(subject().find('form').length).toBe(1)
   })

   it('should have 9 Fields inside the form', () => {
     expect(subject().find('Fields').length).toBe(1)
     expect(subject().find('Field').length).toBe(8)
   })

})
