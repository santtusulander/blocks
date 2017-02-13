import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-form-group-multi-option-selector')
import FieldFormGroupMultiOptionSelector from '../field-form-group-multi-option-selector'

const meta = { touched: false },
     input = { name: 'foo' }

const subject = shallow(
  <FieldFormGroupMultiOptionSelector
    meta={meta}
    input={input} />
)

describe('FieldFormGroupMultiOptionSelector', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
