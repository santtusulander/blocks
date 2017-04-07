import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-task')
import IconTask from '../icon-task'

const subject = shallow(
  <IconTask className="foo" />
)

describe('IconTask', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
