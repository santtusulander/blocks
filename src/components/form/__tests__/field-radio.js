import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-radio')
import FieldRadio from '../field-radio'

const subject = (label = (<div className="label"></div>)) => {
  return shallow(<FieldRadio label={label} />)
}

describe('FieldRadio', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('label should exist when it was given', () => {
    expect(subject().find('.label').length).toBe(1)
  })

  it('label should not exist when it was not given', () => {
    expect(subject('').find('.label').length).toBe(0)
  })
})
