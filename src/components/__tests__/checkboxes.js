import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../checkboxes')
import Checkboxes from '../checkboxes'

const subject = shallow(<Checkboxes iterable={[]} field={{ value: [] }}/>)

describe('Checkboxes', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })

})
