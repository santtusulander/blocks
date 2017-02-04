import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../location-form.jsx')
jest.genMockFromModule('react-bootstrap')

import NetworkLocationForm from '../location-form'
import { FormattedMessage } from 'react-intl'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkLocationForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = (edit = false) => {
      const initialValues = edit ? {name: 'udn'} : {}
      props = {
        onCancel,
        onSave,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues,
        fields: {
          name: { touched, error, value: '' },
          latitude: { touched, error, value: '' },
          cloudProviderLocationId: { touched, error, value: '' }
        }
      }
      return shallow(<NetworkLocationForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 buttons on Add', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 3 buttons on Edit', () => {
    expect(subject(true).find('Button').length).toBe(3)
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
