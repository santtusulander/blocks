import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-radio')
import FieldRadio from '../field-radio'

const subject = shallow(
  <FieldRadio />
)

describe('FieldRadio', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
