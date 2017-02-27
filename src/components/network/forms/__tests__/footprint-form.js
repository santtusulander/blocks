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
    subject = (editing = false, addFootprintMethod = 'manual') => {
      props = {
        addFootprintMethod,
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

  it('should have 2 buttons on Add', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 2 buttons on Edit', () => {
    expect(subject(true).find('Button').length).toBe(2)
  })

  it('should not show file upload form when method is manual', () => {
    expect(subject(true).find('.csv-upload').length).toBe(0)
  })

  it('should show file upload form when method is addfile', () => {
    expect(subject(true, 'addfile').find('.csv-upload').length).toBe(1)
  })
})
