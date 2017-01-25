import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-number')
import FieldFormGroupNumber from '../field-form-group-number'

const meta = { touched: false },
     input = { name: 'foo' }

const subject = shallow(
  <FieldFormGroupNumber
    meta={meta}
    input={input} />
)

describe('FieldFormGroupNumber', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
