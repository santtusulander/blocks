import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tools.jsx')
import Tools from '../tools.jsx'

describe('Tools', () => {
  it('should exist', () => {
    const tools = shallow(<Tools/>)
    expect(tools.find('.account-support-tools').length).toBe(1)
  });
})
