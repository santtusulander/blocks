import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-question-mark')
import IconQuestionMark from '../icon-question-mark'

const subject = shallow(
  <IconQuestionMark />
)

describe('IconQuestionMark', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
