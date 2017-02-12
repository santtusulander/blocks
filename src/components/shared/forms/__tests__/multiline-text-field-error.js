import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../multiline-text-field-error')
import MultilineTextFieldError from '../multiline-text-field-error'

const subject = shallow(
  <MultilineTextFieldError />
)

describe('MultilineTextFieldError', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
