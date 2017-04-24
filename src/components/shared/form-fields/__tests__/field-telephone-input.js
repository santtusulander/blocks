import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-telephone-input')
import FieldTelephoneInput from '../field-telephone-input'

describe('FieldTelephoneInput', () => {
  let subject = null

  beforeEach(() => {
    subject = (error = '',
               label = (<div></div>)) => {
      const props = {
        label,
        full_phone_number: {
          input: {
            name: 'full_phone_number',
            value: '199999999'
          },
          meta: {
            error: error,
            touched: error ? true : false
          },
          onChange: () => {}
        },
        phone_number: {
          input: {
            name: 'phone_number',
            value: '99999999'
          },
          onChange: () => {}
        },
        phone_country_code: {
          input: {
            name: 'phone_country_code',
            value: '1'
          },
          onChange: () => {}
        },
      }

      return shallow(
        <FieldTelephoneInput {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('label should exist when it was given', () => {
    expect(subject().find('ControlLabel').length).toBe(1)
  })

  it('label should not exist when it was not given', () => {
    expect(subject('', '').find('ControlLabel').length).toBe(0)
  })

  it('error text should exist when error flags are true', () => {
    expect(subject('error').find('DefaultErrorBlock').length).toBe(1)
  })

  it('error text should not exist when error flags are false', () => {
    expect(subject().find('DefaultErrorBlock').length).toBe(0)
  })
})
