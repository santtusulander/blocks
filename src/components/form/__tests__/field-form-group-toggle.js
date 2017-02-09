import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-toggle')
import FieldFormGroupToggle from '../field-form-group-toggle'

describe('FieldFormGroupToggle', () => {
  let subject = null

  beforeEach(() => {
    subject = (label = (<div></div>)) => {
      const props = {
        label,
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
    expect(subject().find('ControlLabel').length).toBe(1)
  })
})
