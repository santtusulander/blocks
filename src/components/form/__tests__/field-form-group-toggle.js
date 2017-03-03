import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-toggle')
import FieldFormGroupToggle from '../field-form-group-toggle'

describe('FieldFormGroupToggle', () => {
  let subject = null

  beforeEach(() => {
    subject = (label = null,
               addonAfter = (<div className="addonAfter"></div>),
               addonBefore = (<div className="addonBefore"></div>),
               addonAfterLabel = (<div className="addonAfterLabel"></div>)) => {
      const props = {
        label,
        addonAfter,
        addonBefore,
        addonAfterLabel,
        input: {
          name: 'name'
        }
      }

      return shallow(
        <FieldFormGroupToggle {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('label should exist when it was given', () => {
    expect(subject((<div></div>)).find('ControlLabel').length).toBe(1)
  })

  it('AddonAfter should exist when it was given', () => {
    expect(subject(null).find('.addonAfter').length).toBe(1)
  })

  it('AddonAfter should not exist when it was not given', () => {
    expect(subject(null, null).find('.addonAfter').length).toBe(0)
  })

  it('AddonBefore should exist when it was given', () => {
    expect(subject(null, null).find('.addonBefore').length).toBe(1)
  })

  it('AddonBefore should not exist when it was not given', () => {
    expect(subject(null, null, null).find('.addonBefore').length).toBe(0)
  })

  it('AddonAfterLabel should exist when it was given', () => {
    expect(subject((<div></div>), null, null).find('.addonAfterLabel').length).toBe(1)
  })

  it('AddonAfterLabel should not exist when it was not given', () => {
    expect(subject((<div></div>), null, null, null).find('.addonAfterLabel').length).toBe(0)
  })
})
