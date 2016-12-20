import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-dashboard')
import IconDashboard from '../icon-dashboard'

const subject = shallow(
  <IconDashboard />
)

describe('IconDashboard', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
