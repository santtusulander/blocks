import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-problem')
import IconProblem from '../icon-problem'

const subject = shallow(
  <IconProblem className="foo" />
)

describe('IconProblem', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
