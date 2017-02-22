import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pop-form.jsx')
jest.genMockFromModule('react-bootstrap')

import NetworkPopForm from '../pop-form.jsx'
import { FormattedMessage } from 'react-intl'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkPopForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false
  let popPermissions = {}

  beforeEach(() => {
    subject = (id = null, permissions) => {
      popPermissions = {deleteAllowed: true, modifyAllowed: true, ...permissions}
      props = {
        onCancel,
        onSave,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          id: id,
          name: 'udn'
        },
        fields: {
          name: { touched, error, value: '' },
          locationId: { touched, error, value: [] },
          popId: { touched, error, value: '' }
        },
        popPermissions
      }
      return shallow(<NetworkPopForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 buttons on Add', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 3 buttons on Edit', () => {
    expect(subject('testId').find('Button').length).toBe(2)
    expect(subject('testId').find('ButtonDisableTooltip').length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(
      subject()
        .find('input .error-msg')
        .at(0)
    ).toBeTruthy()
  })

  it('should not have a Delete button if no delete permission', () => {
    expect(subject('testId', {deleteAllowed: false}).find('ButtonDisableTooltip').length).toBe(0)
  })

  it('should not have Submit button if no modify permission', () => {
    expect(subject('testId', {modifyAllowed: false}).find('Button[type="submit"]').length).toBe(0)
  })
})
