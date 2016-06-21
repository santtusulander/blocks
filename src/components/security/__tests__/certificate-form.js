import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
jest.unmock('../certificate-form.jsx')
import CertificateForm from '../certificate-form.jsx'

const REQUIRED = 'Required'

describe('SoaEditForm', () => {
  const onSave = jest.genMockFunction()
  const onCancel = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = () => {
      props = {
        errors: {},
        accounts: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }]),
        groups: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }]),
        onSave,
        onCancel,
        fields: {
          account: { touched, error, value: '' },
          group: { touched, error, value: '' },
          title: { touched, error, value: '' },
          privateKey: { touched, error, value: '' },
          interMediateCert: { touched, error, value: '' },
          certificate: { touched, error, value: '' }
        }
      }
      return shallow(<CertificateForm {...props}/>)
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
    expect(subject().find('#privateKey .error-msg').text()).toBe(REQUIRED)
  })
})
