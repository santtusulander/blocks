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
    phone_number: {
      value: "test"
    },
    timezon: {
      value: "test"
    }
  }
}

describe('UserEditForm', () => {
  let subject, props = null

  const fields = makeFakeFields()
  const intl = intlMaker()
  const invalid = false
  const onSave = jest.genMockFunction()
  const onSavePassword = jest.genMockFunction()
  const resetForm = jest.genMockFunction()
  const savingPassword = true
  const savingUser = true

  beforeEach(() => {
     subject = () => {
       props = {
         fields,
         intl,
         invalid,
         onSave,
         onSavePassword,
         resetForm,
         savingPassword,
         savingUser
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

   it('should have 3 divs inside the form', () => {
     expect(subject().find('form').find('div.form-group').length).toBe(3)
   })

})
