import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../network-form.jsx')
jest.genMockFromModule('react-bootstrap')

import NetworkForm from '../network-form.jsx'
import { FormattedMessage } from 'react-intl'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false
  let networkPermissions = {}

  beforeEach(() => {
    subject = (edit = false, permissions = {}) => {
      networkPermissions = {deleteAllowed: true, modifyAllowed: true, ...permissions}
      props = {
        onCancel,
        onSave,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: 'test network',
          description: 'test description'
        },
        fields: {
          name: { touched, error, value: '' },
          description: { touched, error, value: '' }
        },
        edit: edit,
        networkPermissions
      }
      return shallow(<NetworkForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 buttons on Add', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 3 buttons on Edit', () => {
    expect(subject(true).find('Button').length).toBe(2)
    expect(subject(true).find('ButtonDisableTooltip').length).toBe(1)
  })

  it('should not have Save button if no modify permission', () => {
    expect(subject(true, {modifyAllowed: false}).find('Button[type="submit"]').length).toBe(0);
  })

  it('should not have Delete button if no delete permission', () => {
    expect(subject(true, {deleteAllowed: false}).find('ButtonDisableTooltip').length).toBe(0);
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
