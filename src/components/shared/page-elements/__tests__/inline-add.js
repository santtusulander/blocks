import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../inline-add')
import InlineAdd from '../inline-add'

const inlineAddInputs = []

const subject = shallow(
  <InlineAdd inputs={inlineAddInputs} />
)

describe('InlineAdd', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
