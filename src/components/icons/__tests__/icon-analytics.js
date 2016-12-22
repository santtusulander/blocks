import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-analytics')
import IconAnalytics from '../icon-analytics'

const subject = shallow(
  <IconAnalytics />
)

describe('IconAnalytics', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
