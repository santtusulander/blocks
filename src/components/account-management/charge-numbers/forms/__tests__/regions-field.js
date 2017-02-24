import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../regions-field')
import RegionsField from '../regions-field'

const fields = {
  getAll: jest.fn()
}
const meta = {
  error: ''
}


const subject = shallow(
  <RegionsField
    fields={fields}
    meta = {meta}
  />
)

describe('RegionsField', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
