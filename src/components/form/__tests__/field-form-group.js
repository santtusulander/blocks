import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group')
import FieldFormGroup from '../field-form-group'

describe('FieldFormGroup', () => {
  let subject = null

  beforeEach(() => {
    subject = (addonAfter = '', addonBefore = '', error = '', label = '') => {
      const props = {
        addonBefore,
        addonAfter,
        label,
        meta: {
          error: error,
          touched: error ? true : false
        },
        input: {
          name: 'name'
        }
      }

      return shallow(
        <FieldFormGroup {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('AddonAfter should exist when it was given', () => {
    expect(subject((<div id='addonAfter'></div>)).find('#addonAfter').length).toBe(1)
  })

  it('AddonAfter should not exist when it was not given', () => {
    expect(subject('').find('#addonAfter').length).toBe(0)
  })

  it('AddonBefore should exist when it was given', () => {
    expect(subject((<div id='addonBefore'></div>)).find('#addonBefore').length).toBe(1)
  })

  it('AddonBefore should not exist when it was not given', () => {
    expect(subject('', '').find('#addonBefore').length).toBe(0)
  })

  it('error text should exist when error flags are true', () => {
    expect(subject('', '', 'error').find('DefaultErrorBlock').length).toBe(1)
  })

  it('error text should not exist when error flags are false', () => {
    expect(subject('', '', '').find('DefaultErrorBlock').length).toBe(0)
  })

  it('label should exist when it was given', () => {
    expect(subject('', '', '', 'label').find('ControlLabel').length).toBe(1)
  })

  it('label should not exist when it was not given', () => {
    expect(subject('', '', '', '').find('ControlLabel').length).toBe(0)
  })
})
