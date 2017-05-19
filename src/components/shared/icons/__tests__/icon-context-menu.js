import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-context-menu')
import IconContextMenu from '../icon-context-menu'

const subject = shallow(
  <IconContextMenu />
)

describe('IconContextMenu', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
