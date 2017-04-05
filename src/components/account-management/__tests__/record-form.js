import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../record-form')
jest.unmock('../../../constants/dns-record-types')
jest.unmock('../../../decorators/key-stroke-decorator')
jest.unmock('../../../util/dns-records-helpers')
jest.unmock('../../shared/form-elements/select-wrapper.jsx')

import RecordForm from '../record-form.jsx'
import { isShown } from '../../../util/dns-records-helpers'

const REQUIRED = 'Required'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('RecordForm', () => {
  let cancel
  let handleSubmit
  let subject, error, props
  let touched

  beforeEach(() => {
    cancel = jest.fn()
    handleSubmit = jest.fn()
    subject, error, props = null
    touched = false

    subject = (typeValue, invalid ) => {
      props = {
        handleSubmit,
        cancel,
        intl: intlMaker(),
        invalid: invalid || false,
        shouldShowField: isShown(typeValue || ''),
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
    subject()
      .find('#submit-button')
      .simulate('click')
    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should show prio field for MX record', () => {
    expect(
      subject('MX')
        .find('#prio-field')
    ).toHaveLength(1)
  })

  it('should disable submit button', () => {
    subject(null, true).find('#submit-button .disabled')
    expect(handleSubmit.mock.calls.length).toBe(1)
  })

  it('should handle onCancel click', () => {
    subject().find('#cancel-button').simulate('click')
    expect(cancel.mock.calls.length).toBe(1)
  })
})
