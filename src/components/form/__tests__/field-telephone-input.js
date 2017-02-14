import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-telephone-input')
import FieldTelephoneInput from '../field-telephone-input'

const meta = { touched: false },
     input = {
       name: 'foo',
       value: {
         phone_country_code: '001',
         phone_number: '99999999'
       },
       onChange: () => {}
     }

const subject = shallow(
  <FieldTelephoneInput
    meta={meta}
    input={input} />
)

describe('FieldTelephoneInput', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
