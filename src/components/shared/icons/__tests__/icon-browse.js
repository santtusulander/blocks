import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-browse')
import IconBrowse from '../icon-browse'

const subject = shallow(
  <IconBrowse />
)

describe('IconBrowse', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
