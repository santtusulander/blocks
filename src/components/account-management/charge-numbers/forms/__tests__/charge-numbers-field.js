import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../charge-numbers-field')
import ChargeNumbersField from '../charge-numbers-field'

const meta = { touched: false },
     input = { name: 'foo' }

const subject = shallow(
  <ChargeNumbersField
    meta={meta}
    input={input} />
)

describe('ChargeNumbersField', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})