import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tools.jsx')
import Tools from '../tools.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('Tools', () => {
  it('should exist', () => {
    const tools = shallow(<Tools intl={intlMaker()}/>)
    expect(tools.find('.account-support-tools').length).toBe(1)
  });
})
