import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-number')
import FieldFormGroupNumber from '../field-form-group-number'

describe('FieldFormGroupNumber', () => {
  let subject = null

  beforeEach(() => {
    subject = (error,
               label = (<div></div>),
               addonAfter = (<div className="addonAfter"></div>),
               addonBefore = (<div className="addonBefore"></div>)) => {
      const props = {
        label,
        addonAfter,
        addonBefore,
        input: {
          name: 'name'
        },
        meta: {
          error: error,
          touched: error ? true : false
        }
      }

      return shallow(
        <FieldFormGroupNumber {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('AddonAfter should exist when it was given', () => {
    expect(subject('', '').find('.addonAfter').length).toBe(1)
  })

  it('AddonAfter should not exist when it was not given', () => {
    expect(subject('', '', '').find('.addonAfter').length).toBe(0)
  })

  it('AddonBefore should exist when it was given', () => {
    expect(subject('', '', '').find('.addonBefore').length).toBe(1)
  })

  it('AddonBefore should not exist when it was not given', () => {
    expect(subject('', '', '', '').find('.addonBefore').length).toBe(0)
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
    expect(subject('').find('DefaultErrorBlock').length).toBe(0)
  })
})
