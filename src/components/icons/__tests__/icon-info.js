import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-info')
import IconInfo from '../icon-info'

const subject = shallow(
  <IconInfo className="foo" />
)

describe('IconInfo', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
