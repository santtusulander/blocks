import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-checkbox')
import FieldFormGroupCheckbox from '../field-form-group-checkbox'

describe('FieldFormGroupCheckbox', () => {

  let subject = null

  beforeEach(() => {
    subject = (error,
               label = (<div></div>),
               addonAfter = (<div className="addon"></div>)) => {
      const props = {
        label,
        addonAfter,
        input: {
          name: 'name'
        },
        meta: {
          error: error,
          touched: error ? true : false
        }
      }

      return shallow(
        <FieldFormGroupCheckbox {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('Addon should exist when it was given', () => {
    expect(subject('', '').find('.addon').length).toBe(1)
  })

  it('Addon should not exist when it was not given', () => {
    expect(subject('', '', '').find('.addon').length).toBe(0)
  })

  it('label should exist when it was given', () => {
    expect(subject().find('ControlLabel').length).toBe(1)
  })

  it('label should not exist when it was not given', () => {
    expect(subject('', '').find('ControlLabel').length).toBe(0)
  })

  it('error text should exist when error flags are true', () => {
    expect(subject('error').find('HelpBlock').length).toBe(1)
  })

  it('error text should not exist when error flags are false', () => {
    expect(subject('').find('HelpBlock').length).toBe(0)
  })
})
