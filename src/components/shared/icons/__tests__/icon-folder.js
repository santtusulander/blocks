import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-folder')
import IconFolder from '../icon-folder'

const subject = shallow(
  <IconFolder />
)

describe('IconFile', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
