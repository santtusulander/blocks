import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-select')
import FieldFormGroupSelect from '../field-form-group-select'

describe('FieldFormGroupSelect', () => {
  let subject = null

  beforeEach(() => {
    subject = (addonAfter = '', addonBefore = '', error = '', label = '', addonAfterLabel = '') => {
      const props = {
        addonBefore,
        addonAfter,
        label,
        addonAfterLabel,
        meta: {
          error: error,
          touched: error ? true : false
        },
        input: {
          name: 'name'
        }
      }

      return shallow(
        <FieldFormGroupSelect {...props}/>
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

  it('AddonAfterLabel should exist when it was given with the label', () => {
    expect(subject('', '', '', 'label', (<div id='addonAfterLabel'></div>)).find('#addonAfterLabel').length).toBe(1)
  })

  it('AddonAfterLabel should not exist when label was not given', () => {
    expect(subject('', '', '', null, (<div id='addonAfterLabel'></div>)).find('#addonAfterLabel').length).toBe(0)
  })

  it('AddonAfterLabel should not exist when it was not given', () => {
    expect(subject('', '', '', 'label', '').find('.addonAfterLabel').length).toBe(0)
  })
})
