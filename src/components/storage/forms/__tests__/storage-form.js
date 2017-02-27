import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-form.jsx')
jest.genMockFromModule('react-bootstrap')

import StorageForm from '../storage-form.jsx'
import { FormattedMessage } from 'react-intl'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('StorageForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = (edit = false) => {
      props = {
        onCancel,
        onSave,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: edit ? 'test storage' : ''
        },
        fields: {
          name: { touched, error, value: '' }
        },
        edit: edit
      }
      return shallow(<StorageForm {...props}/>)
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
