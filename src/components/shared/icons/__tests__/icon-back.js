import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-back')
import IconBack from '../icon-back'

const subject = shallow(
  <IconBack />
)

describe('IconBack', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
