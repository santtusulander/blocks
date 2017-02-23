import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../footprint-form.jsx')
jest.genMockFromModule('react-bootstrap')

import FootprintForm from '../footprint-form'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('FootprintForm', () => {
  let subject, error, props = null
  let touched = false
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const handleSubmit = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        onCancel,
        onSave,
        handleSubmit,
        intl: intlMaker(),
        initialValues: {
          addFootprintMethod: 'manual',
          dataType: 'cidr'
        },
        fields: {
          footPrintName: { touched, error, value: '' },
          footPrintDescription: { touched, error, value: '' },
          UDNType: { touched, error, value: '' }
        }
      }
      return shallow(<FootprintForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(
      subject()
        .find('input .error-msg')
        .at(0)
    ).toBeTruthy()
  })
})
