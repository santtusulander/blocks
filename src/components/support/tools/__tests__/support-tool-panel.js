import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../support-tool-panel.jsx')
jest.unmock('classnames')
import SupportToolPanel from '../support-tool-panel'

describe('SupportToolPanel', () => {
  it('should exist', () => {
    const wrapper = shallow(<SupportToolPanel/>)
    expect(wrapper.find('.support-tool-panel').length).toBe(1)
  });

  it('can be passed a custom class name', () => {
    const supportToolPanel = shallow(<SupportToolPanel className="foo"/>)
    expect(supportToolPanel.find('.foo').length).toBe(1)
  });
})
