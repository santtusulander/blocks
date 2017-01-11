import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../../../decorators/key-stroke-decorator')

jest.unmock('../record-form')
import RecordFormContainer from '../record-form'

const subject = shallow(
  <RecordFormContainer />
)

describe('RecordFormContainer', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
