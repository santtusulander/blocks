import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../charge-numbers-field')

import ChargeNumbersField from '../charge-numbers-field'

let subject, onChange

describe('ChargeNumbersField', () => {
  beforeEach(() => {
    onChange = jest.fn()

    subject = () => {
      const props = {
        input : {
          value: {charge_number: ''},
          onChange
        }
      }
      return shallow(<ChargeNumbersField {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should call onChange function', () => {
    const inputs = subject().find('Radio')

    inputs.at(1).simulate('change', {target: {value: 'global'}})

    expect(onChange).toHaveBeenCalled()
  })
})
