import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
jest.unmock('../certificate-form.jsx')
import CertificateForm from '../certificate-form.jsx'

const REQUIRED = 'Required'

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
        accounts: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }]),
        groups: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }]),
        onSubmit,
        onCancel,
        fields: {
          account: { touched, error, value: '' },
          group: { touched, error, value: '' },
          title: { touched, error, value: '' },
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

  it('should handle onSave click', () => {
    subject().find('#save_button').simulate('click')
    expect(onSubmit.mock.calls.length).toBe(1)
  })

  it('should handle onCancel click', () => {
    subject().find('#cancel_button').simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })
})
