import React from 'react'
import Immutable from 'immutable'
import { mount, shallow, render } from 'enzyme'

jest.genMockFromModule('react-bootstrap')
jest.unmock('../brand-edit-form');
import BrandEditForm from '../brand-edit-form'


const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('BrandEditForm', () => {
  const onCancel = jest.fn()
  const onSave = jest.fn()
  let subject, error, props = null
  let touched = false
  const mockProviderTypes = [{
    value: 1,
    label: (<div id="testLabel">Test</div>)
  }]
  const mockAccount = Immutable.fromJS({
    id: 1,
    name: 'Test'
  })

  beforeEach(() => {
    subject = (errorMsg, edit = false, accountProp, accountType, providerTypes = mockProviderTypes) => {
      props = {
        account: accountProp,
        error: errorMsg,
        edit: edit,
        onCancel,
        onSave,
        accountType,
        providerTypes,
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        values: {
          brandName: 'udn'
        },
        fields: {
          brandName: { touched, error: !!errorMsg, value: '' },
          brandLogo: { touched, error, value: '' },
          favicon: { touched, error, value: '' },
          colorTheme: { touched, error, value: [] },
          availability: { touched, error, value: [] }
        }
      }
      return shallow(<BrandEditForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should exist when edit equals true', () => {
    expect(subject("", true).length).toBe(1)
  })

  it('should render form', () => {
    expect(subject().find('form').length).toBe(1)
  })

  it('should render 2 Buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should render 6 Fields', () => {
    expect(subject("").find('Field').length).toBe(6)
  })

  it('should render error messages', () => {
    expect(subject("error").find('.help-block').text()).toBe("error")
  })

  it('should not render error messages if empty', () => {
    expect(subject("").find('.help-block').length).toBe(0)
  })
})
