import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../field-passwordfields')
import FieldPasswordFields from '../field-passwordfields'

const subject = shallow(
  <FieldPasswordFields />
)

describe('FieldPasswordFields', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
