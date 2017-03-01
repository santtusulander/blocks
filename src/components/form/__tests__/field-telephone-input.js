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
        input: {
          name: 'name',
          value: {
            phone_country_code: '001',
            phone_number: '99999999'
          },
          onChange: () => {}
        },
        meta: {
          error: error,
          touched: error ? true : false
        }
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
