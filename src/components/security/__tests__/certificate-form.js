import React from 'react'
import { shallow } from 'enzyme'
import { List, fromJS } from 'immutable'
jest.unmock('../certificate-form.jsx')
import CertificateForm from '../certificate-form.jsx'


const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('Certificate Form', () => {
  const onSubmit = jest.genMockFunction()
  const onCancel = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker(),
        errors: {},
        groupsOptions: [{ label: 'aaa', value: 1 }, { label: 'bbb', value: 2 }],
        onSubmit,
        onCancel,
        certificateToEdit: List(),
        fields: {
          group: { touched, error, value: '' },
          title: { touched, error, value: ''},
          privateKey: { touched, error, value: '' },
          intermediateCertificates: { touched, error, value: '' },
          certificate: { touched, error, value: '' }
        }
      }
      return shallow(<CertificateForm {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 5 fields', () => {
    expect(subject().find('Field').length).toBe(5)
  })

  it('should submit form', () => {
    subject().find('form').simulate('submit')
    expect(onSubmit).toBeCalled();
  })

  it('should handle onCancel click', () => {
    subject().find('#cancel_button').simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(subject().find('input .error-msg').at(0)).toBeTruthy()
  })
})
