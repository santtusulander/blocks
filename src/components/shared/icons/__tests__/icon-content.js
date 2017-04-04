import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-content')
import IconContent from '../icon-content'

const subject = shallow(
  <IconContent />
)

describe('IconContent', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
