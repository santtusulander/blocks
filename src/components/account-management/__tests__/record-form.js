import React from 'react'
import { shallow } from 'enzyme'
jest.unmock('../record-form.jsx')
jest.unmock('underscore')
jest.unmock('../../../util/dns-records-helpers')
jest.unmock('../../../constants/dns-record-types')
import { RecordForm } from '../record-form.jsx'

import { isShown } from '../../../util/dns-records-helpers'

const REQUIRED = 'Required'

describe('SoaEditForm', () => {
  const cancel = jest.genMockFunction()
  const submit = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = (typeValue, invalid, ) => {
      props = {
        invalid: invalid || false,
        shouldShowField: isShown(typeValue || ''),
        submit,
        cancel,
        fields: {
          type: { touched, error, value: typeValue || ''},
          name: { touched, error, value: '' },
          value: { touched, error, value: '' },
          ttl: { touched, error, value: '' },
          prio: { touched, error, value: '' },
          certificate: { touched, error, value: '' }
        }
      }
      return shallow(<RecordForm {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should handle onSave click', () => {
    subject().find('#submit-button').simulate('click')
    expect(submit.mock.calls.length).toBe(1)
  })

  it('should show prio field for MX record', () => {
    expect(subject('MX').find('#prio-field').length).toBe(isShown('MX')('prio') ? 1 : 0)
  })

  it('should disable submit button', () => {
    subject(null, true).find('#submit-button .disabled')
    expect(submit.mock.calls.length).toBe(1)
  })

  it('should handle onCancel click', () => {
    subject().find('#cancel-button').simulate('click')
    expect(cancel.mock.calls.length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    error = REQUIRED
    expect(subject('MX').find('#name-err').length).toBe(isShown('MX')('name') ? 1 : 0)
  })
})
