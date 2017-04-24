import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../save-bar')
import SaveBar from '../save-bar'

const subject = shallow(
  <SaveBar />
)

describe('SaveBar', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
